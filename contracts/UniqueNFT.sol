// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UniqueNFT is ERC721URIStorage, Ownable {

  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdTracker;

  string private _baseTokenURI;

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC721(name, symbol) {
    _setBaseURI(baseTokenURI);
  }

  function currentId() public view virtual returns (uint256) {
    return _tokenIdTracker.current();
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }

  function _setBaseURI(string memory baseTokenURI) internal {
    _baseTokenURI = baseTokenURI;
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
