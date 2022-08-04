// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
    bool isRevealed
  );

  event ProjectStarted(
    uint256 projectId,
    uint256 state
  );

  event ProjectClosed(
    uint256 projectId,
    uint256 state
  );

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

  function createERC721Project(
    uint256 backendId,
    string memory projectName,
    string[] memory baseTokenURIs,
    uint256[] memory saleData,
    address[] memory whitelists,
    bool canReveal,
    bytes calldata signature
  ) external returns (uint256);

  function revealProject(
    uint256 projectId
  ) external;

  function startProject(
    uint256 projectId
  ) external;

  function closeProject(
    uint256 projectId
  ) external;

  function buyPresale(
    uint256 projectId,
    uint256 amount
  ) external payable;

  function buy(
    uint256 projectId,
    uint256 amount
  ) external payable;
}