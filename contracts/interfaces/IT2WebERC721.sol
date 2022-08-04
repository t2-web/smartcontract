// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IT2WebERC721 is IERC721 {
  function setBaseURI(string memory baseTokenURI) external;

  function mint(address to) external returns (uint256);

  function burn(uint256 tokenId) external;
}