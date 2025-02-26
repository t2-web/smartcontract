// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IT2WebProjectManager {
  event ProjectCreated(
    uint256 backendId,
    uint256 projectId,
    uint256 contractType,
    address contractAddress,
    address owner,
    bool canReveal,
    bool isRevealed,
    uint256 state
  );

  event ProjectRevealed(
    uint256 projectId,
    bool isRevealed,
    string baseTokenURI
  );

  event ProjectClosed(uint256 projectId, uint256 state);

  event ProjectItemSold(
    uint256 projectId,
    address buyer,
    uint256 amount,
    uint256 totalAmount
  );

  event ProjectItemPreSold(
    uint256 projectId,
    address buyer,
    uint256 amount,
    uint256 totalAmount
  );

  function setSigner(address signer) external;

  function setFeeReceiver(address feeReceiver) external;

  function createERC721Project(
    uint256 backendId,
    string memory projectName,
    string memory projectSymbol,
    string memory baseTokenURI,
    uint256[] memory saleData,
    bool hasWhitelist,
    bool canReveal,
    bytes calldata signature
  ) external returns (uint256);

  function revealProject(uint256 projectId, string memory baseTokenURI)
    external;

  function closeProject(uint256 projectId) external;

  function buyPresale(
    uint256 projectId,
    uint256 amount,
    bytes calldata signature
  ) external payable;

  function buy(uint256 projectId, uint256 amount) external payable;

  function getPresaleAmountOf(uint256 projectId, address userAddress)
    external
    view
    returns (uint256);

  function getPublicsaleAmountOf(uint256 projectId, address userAddress)
    external
    view
    returns (uint256);

  function getPresaleSoldAmount(uint256 projectId)
    external
    view
    returns (uint256);

  function getPublicsaleSoldAmount(uint256 projectId)
    external
    view
    returns (uint256);
}
