// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // security for non-reentrant
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../interfaces/IT2WebProjectManager.sol";
import "../interfaces/IT2WebERC721.sol";

import "../lib/Signature.sol";
import "./T2WebERC721.sol";

contract T2WebProjectManager is
  IT2WebProjectManager,
  ERC721Holder,
  ReentrancyGuard,
  AccessControlUpgradeable,
  OwnableUpgradeable
{
  using Strings for uint256;
  using Signature for bytes32;
  using Counters for Counters.Counter;

  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  uint256 public constant A_HUNDRED_PERCENT = 10_000; // 100%

  Counters.Counter private _projectIdTracker;

  enum ProjectState {
    NEW,
    READY,
    CREATED,
    STARTED,
    FINISHED,
    ERROR
  }

  struct Project {
    uint256 id;
    uint256 backendId;
    address owner;
    uint256 contractType; // 721, 1155, 4907
    address contractAddress;
    ProjectState state;
    uint256 presaleStartDate;
    uint256 presaleEndDate;
    uint256 presalePrice;
    uint256 presaleAmount;
    uint256 presaleSold;
    uint256 presaleMaxPurchase;
    uint256 publicsaleStartDate;
    uint256 publicsaleEndDate;
    uint256 publicsalePrice;
    uint256 publicsaleAmount;
    uint256 publicsaleMaxPurchase;
    uint256 publicsaleSold;
    uint256 fee;
    bool hasWhitelist;
    bool canReveal;
    bool isRevealed;
  }

  address private _erc721Implementation;

  address private _feeReceiver;
  address private _signer;

  // project id => project
  mapping(uint256 => Project) private _projects;

  mapping(uint256 => bool) private _createdProjects;

  mapping(uint256 => mapping(address => uint256)) private _presaleAmount;

  mapping(uint256 => mapping(address => uint256)) private _publicsaleAmount;

  modifier notZeroAddress(address account) {
    require(account != address(0), "ProjectManager: address must not be zero");
    _;
  }

  function initialize(address feeReceiver, address signer)
    external
    initializer
  {
    address msgSender = _msgSender();
    _setupRole(DEFAULT_ADMIN_ROLE, msgSender);
    _setupRole(OPERATOR_ROLE, msgSender);
    _signer = signer;
    _feeReceiver = feeReceiver;

    _erc721Implementation = address(new T2WebERC721());
  }

  function setSigner(address signer) external {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
      "ProjectManager: caller is not admin"
    );
    _signer = signer;
  }

  function setFeeReceiver(address feeReceiver) external {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
      "ProjectManager: caller is not admin"
    );
    _feeReceiver = feeReceiver;
  }

  receive() external payable {}

  function createERC721Project(
    uint256 backendId,
    string memory projectName,
    string memory projectSymbol,
    string memory baseTokenURI,
    uint256[] memory saleData,
    bool hasWhitelist,
    bool canReveal,
    bytes calldata signature
  ) external returns (uint256) {
    // Verify sign
    bytes32 messageHash = keccak256(
      abi.encodePacked(
        backendId,
        msg.sender,
        saleData[2],
        saleData[3],
        saleData[4],
        saleData[7],
        saleData[8],
        saleData[9],
        saleData[10]
      )
    );
    messageHash.verifySignature(signature, _signer);

    require(_createdProjects[backendId] == false, "KNOWN_TX");
    require(saleData.length == 11, "INVALID_DATA");

    uint256 totalSupply = saleData[3] + saleData[8];
    require(
      totalSupply > 0,
      "ProjectManager: total supply must be greater than 0"
    );

    address contractAddress = Clones.clone(_erc721Implementation);
    T2WebERC721(contractAddress).initialize(
      projectName,
      projectSymbol,
      baseTokenURI,
      totalSupply
    );

    _projectIdTracker.increment();
    uint256 projectId = _projectIdTracker.current();

    Project memory project;
    project.id = projectId;
    project.owner = msg.sender;
    project.backendId = backendId;
    project.contractType = 721;
    project.contractAddress = contractAddress;
    project.state = ProjectState.CREATED;

    project.presaleStartDate = saleData[0];
    project.presaleEndDate = saleData[1];
    project.presalePrice = saleData[2];
    project.presaleAmount = saleData[3];
    project.presaleMaxPurchase = saleData[4];
    project.publicsaleStartDate = saleData[5];
    project.publicsaleEndDate = saleData[6];
    project.publicsalePrice = saleData[7];
    project.publicsaleAmount = saleData[8];
    project.publicsaleMaxPurchase = saleData[9];
    project.fee = saleData[10];

    project.hasWhitelist = hasWhitelist;
    project.canReveal = canReveal;
    project.isRevealed = false;

    _projects[projectId] = project;

    _createdProjects[project.backendId] = true;

    emit ProjectCreated(
      project.backendId,
      project.id,
      project.contractType,
      project.contractAddress,
      project.owner,
      project.canReveal,
      project.isRevealed,
      uint256(project.state)
    );

    return projectId;
  }

  function revealProject(uint256 projectId, string memory baseTokenURI)
    external
  {
    Project storage project = _projects[projectId];

    require(project.canReveal, "ProjectManager: not allowed");
    require(
      project.owner == msg.sender,
      "ProjectManager: caller is not project owner"
    );
    require(!project.isRevealed, "ProjectManager: already revealed");

    IT2WebERC721(project.contractAddress).setBaseURI(baseTokenURI);
    project.isRevealed = true;

    emit ProjectRevealed(project.id, project.isRevealed, baseTokenURI);
  }

  function closeProject(uint256 projectId) external {
    Project storage project = _projects[projectId];

    require(
      project.owner == msg.sender || hasRole(OPERATOR_ROLE, msg.sender),
      "ProjectManager: caller is not project owner or operator"
    );
    require(
      project.state != ProjectState.FINISHED,
      "ProjectManager: project state invalid"
    );

    project.state = ProjectState.FINISHED;

    emit ProjectClosed(project.id, uint256(project.state));
  }

  function buyPresale(
    uint256 projectId,
    uint256 amount,
    bytes calldata signature
  ) external payable nonReentrant notZeroAddress(_msgSender()) {
    Project storage project = _projects[projectId];
    address buyer = _msgSender();

    require(
      project.state == ProjectState.CREATED,
      "ProjectManager: project state invalid"
    );

    require(
      block.timestamp >= project.presaleStartDate &&
        block.timestamp <= project.presaleEndDate,
      "PRESALE_NOT_ALLOWED"
    );

    // Verify signature if needed
    if (project.hasWhitelist) {
      bytes32 messageHash = keccak256(
        abi.encodePacked(project.backendId, projectId, buyer, amount)
      );
      messageHash.verifySignature(signature, _signer);
    }

    require(
      _presaleAmount[project.id][buyer] + amount <= project.presaleMaxPurchase,
      "AMOUNT_OVER_LIMITATION"
    );
    require(
      project.presaleSold + amount <= project.presaleAmount,
      "AMOUNT_INVALID"
    );

    uint256 totalPrice = project.presalePrice * amount;
    require(
      msg.value == totalPrice,
      "ProjectManager: amount does not match with price"
    );

    uint256 fee = (totalPrice * project.fee) / A_HUNDRED_PERCENT;
    uint256 payout = totalPrice - fee;

    payable(_feeReceiver).transfer(fee);
    payable(project.owner).transfer(payout);

    for (uint256 i = 0; i < amount; i++) {
      IT2WebERC721(project.contractAddress).mint(buyer);
    }

    project.presaleSold += amount;
    _presaleAmount[project.id][buyer] += amount;

    emit ProjectItemPreSold(project.id, buyer, amount, project.presaleSold);
  }

  function buy(uint256 projectId, uint256 amount)
    external
    payable
    nonReentrant
    notZeroAddress(_msgSender())
  {
    Project storage project = _projects[projectId];
    address buyer = _msgSender();

    require(
      project.state == ProjectState.CREATED,
      "ProjectManager: project state invalid"
    );
    require(
      block.timestamp >= project.publicsaleStartDate &&
        block.timestamp <= project.publicsaleEndDate,
      "PUBLICSALE_NOT_ALLOWED"
    );
    require(
      _publicsaleAmount[project.id][buyer] + amount <=
        project.publicsaleMaxPurchase,
      "AMOUNT_OVER_LIMITATION"
    );
    require(
      project.publicsaleSold + amount <= project.publicsaleAmount,
      "AMOUNT_INVALID"
    );

    uint256 totalPrice = project.publicsalePrice * amount;
    require(
      msg.value == totalPrice,
      "ProjectManager: amount does not match with price"
    );

    uint256 fee = (totalPrice * project.fee) / A_HUNDRED_PERCENT;
    uint256 payout = totalPrice - fee;

    payable(_feeReceiver).transfer(fee);
    payable(project.owner).transfer(payout);

    for (uint256 i = 0; i < amount; i++) {
      IT2WebERC721(project.contractAddress).mint(buyer);
    }

    project.publicsaleSold += amount;
    _publicsaleAmount[project.id][buyer] += amount;

    emit ProjectItemSold(project.id, buyer, amount, project.publicsaleSold);
  }

  function getPresaleAmountOf(uint256 projectId, address userAddress)
    external
    view
    returns (uint256)
  {
    return _presaleAmount[projectId][userAddress];
  }

  function getPublicsaleAmountOf(uint256 projectId, address userAddress)
    external
    view
    returns (uint256)
  {
    return _publicsaleAmount[projectId][userAddress];
  }

  function getPresaleSoldAmount(uint256 projectId)
    external
    view
    returns (uint256)
  {
    Project storage project = _projects[projectId];
    return project.presaleSold;
  }

  function getPublicsaleSoldAmount(uint256 projectId)
    external
    view
    returns (uint256)
  {
    Project storage project = _projects[projectId];
    return project.publicsaleSold;
  }
}
