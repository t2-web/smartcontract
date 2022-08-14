// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IT2WebERC721 {
  function setBaseURI(string memory baseTokenURI) external;

  function mint(address to) external returns (uint256);

  function burn(uint256 tokenId) external;
}
