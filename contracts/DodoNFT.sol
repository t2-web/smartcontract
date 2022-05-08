// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DodoNFT is ERC721, Ownable {

  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdTracker;

  constructor() public ERC721("DodoNFT", "DODO") {
    _setBaseURI("ipfs://");
  }

  function currentId() public view virtual returns (uint256) {
    return _tokenIdTracker.current();
  }

  function mintItem(address to, string memory tokenURI) public returns (uint256) {
    _tokenIdTracker.increment();
    uint256 tokenId = _tokenIdTracker.current();
    _mint(to, tokenId);
    _setTokenURI(tokenId, tokenURI);
    return tokenId;
  }

  function mintBatch(address to, string memory tokenURI, uint256 quantity) public {
    for (uint256 i = 0; i < quantity; i++) {
      mintItem(to, tokenURI);
    }
  }
}
