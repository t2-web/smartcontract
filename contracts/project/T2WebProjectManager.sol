// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "../interfaces/IT2WebProjectManager.sol";
import "../interfaces/IT2WebERC721.sol";

import "../lib/Signature.sol";
import "./T2WebERC721.sol";

contract T2WebProjectManager is IT2WebProjectManager, ERC721Holder, Ownable {
  using Strings for uint256;
  using Signature for bytes32;
  using Counters for Counters.Counter;

  Counters.Counter private _projectIdTracker;

  enum ProjectState { NEW, READY, MINTING, STARTED, FINISHED, ERROR }

  address private _signer;
  address private _operator;

  struct Project {
    uint256 id;
    string name;
    uint256 backendId;
    address owner;
    uint256 contractType; // 721, 1155, 4907
    address contractAddress;
    string baseTokenURI;
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
    bool canReveal;
    bool isRevealed;
  }

  mapping(uint256 => Project) private _projects;

  mapping(uint256 => bool) private _createdProjects;

  mapping(uint256 => mapping(address => bool)) private _whitelists;

  constructor(address signer) {
    _signer = signer;
    _operator = _msgSender();
  }

  receive() external payable {}

  function createERC721Project(
    uint256 backendId,
    string memory projectName,
    string[] memory baseTokenURIs,
    uint256[] memory saleData,
    address[] memory whitelists,
    bool canReveal,
    bytes calldata signature
  ) external returns (uint256) {
    require(_createdProjects[backendId] == false, "KNOWN_TX");
    require(saleData.length == 11, "INVALID_DATA");
    require(saleData[3] > 0 && saleData[8] > 0, "INVALID_DATA");

    // Verify sign
    bytes32 messageHash = keccak256(abi.encodePacked(
      backendId,
      msg.sender
    ));

    bytes[] memory signatures = new bytes[](1);
    signatures[0] = signature;
    address[] memory signers = new address[](1);
    signers[0] = _signer;
    messageHash.verifySignatures(signatures, signers);

    T2WebERC721 projectContract = new T2WebERC721(
      projectName,
      "T2WEB",
      baseTokenURIs[1]
    );

    _projectIdTracker.increment();
    uint256 projectId = _projectIdTracker.current();

    Project memory project;
    project.id = projectId;
    project.name = projectName;
    project.owner = msg.sender;
    project.backendId = backendId;
    project.contractType = 721;
    project.baseTokenURI = baseTokenURIs[0];
    project.contractAddress = address(projectContract);
    project.state = ProjectState.MINTING;

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

    project.canReveal = canReveal;
    project.isRevealed = false;

    _projects[projectId] = project;

    for (uint i = 0; i < whitelists.length; i++) {
      _whitelists[projectId][whitelists[i]] = true;
    }

    if (!canReveal) {
      projectContract.setBaseURI(baseTokenURIs[0]);
      project.isRevealed = true;
    }

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

  function revealProject(
    uint256 projectId
  ) external {
    Project storage project = _projects[projectId];

    require(project.canReveal, "Not allowed");
    require(project.owner == msg.sender, "Caller is not project owner");
    require(!project.isRevealed, "Already revealed");

    IT2WebERC721(project.contractAddress).setBaseURI(project.baseTokenURI);
    project.isRevealed = true;

    emit ProjectRevealed(project.id, project.isRevealed);
  }

  function startProject(
    uint256 projectId
  ) external {
    Project storage project = _projects[projectId];

    require(project.owner == msg.sender, "Caller is not project owner");
    require(project.state == ProjectState.MINTING, "Project state invalid");

    project.state = ProjectState.STARTED;

    emit ProjectStarted(project.id, uint256(project.state));
  }

  function closeProject(
    uint256 projectId
  ) external {
    Project storage project = _projects[projectId];

    require(project.owner == msg.sender || _operator == msg.sender,
      "Caller is not project owner or operator");
    require(project.state != ProjectState.FINISHED, "Project state invalid");

    project.state = ProjectState.FINISHED;

    emit ProjectClosed(project.id, uint256(project.state));
  }

  function buyPresale(
    uint256 projectId,
    uint256 amount
  ) external payable {
    Project storage project = _projects[projectId];

    require(project.state == ProjectState.STARTED, "Project state invalid");
    require(block.timestamp >= project.presaleStartDate &&
      block.timestamp <= project.presaleEndDate, "PRESALE_NOT_ALLOWED");
    require(amount > 0 && amount <= project.presaleMaxPurchase, "AMOUNT_INVALID");
    require(project.presaleAmount >= project.presaleSold + amount, "AMOUNT_INVALID");
    require(_whitelists[projectId][_msgSender()], "Caller is not whitelisted");

    for (uint i = 0; i < amount; i++) {
      IT2WebERC721(project.contractAddress).mint(_msgSender());
    }

    project.presaleSold = project.presaleSold + amount;

    emit ProjectItemPreSold(
      project.id,
      _msgSender(),
      amount,
      project.presaleSold
    );
  }

  function buy(
    uint256 projectId,
    uint256 amount
  ) external payable {
    Project storage project = _projects[projectId];

    require(project.state == ProjectState.STARTED, "Project state invalid");
    require(block.timestamp >= project.publicsaleStartDate &&
      block.timestamp <= project.publicsaleEndDate, "PUBLICSALE_NOT_ALLOWED");
    require(amount > 0 && amount <= project.publicsaleMaxPurchase, "AMOUNT_INVALID");
    require(project.publicsaleAmount >= project.publicsaleSold + amount, "AMOUNT_INVALID");

    for (uint i = 0; i < amount; i++) {
      IT2WebERC721(project.contractAddress).mint(_msgSender());
    }

    project.publicsaleSold = project.publicsaleSold + amount;

    emit ProjectItemSold(
      project.id,
      _msgSender(),
      amount,
      project.publicsaleSold
    );
  }
}
