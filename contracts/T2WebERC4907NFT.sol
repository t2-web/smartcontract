// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./lib/ERC4907.sol";

contract T2WebERC4907NFT is ERC4907, Ownable {

  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdTracker;

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC4907(name, symbol, baseTokenURI)
  {
  }

  function currentId() public view virtual returns (uint256) {
    return _tokenIdTracker.current();
  }

  function mintItem(address to, string memory tokenURI) public returns (uint256) {
    _tokenIdTracker.increment();
    uint256 tokenId = _tokenIdTracker.current();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, tokenURI);
    return tokenId;
  }

  function burn(uint256 tokenId) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not owner nor approved");
    _burn(tokenId);
  }
}
