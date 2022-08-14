// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "../interfaces/IT2WebERC721.sol";

contract T2WebERC721 is IT2WebERC721, ERC721URIStorageUpgradeable {
  using Strings for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdTracker;

  address private _operator;
  string private _baseTokenURI;

  function initialize(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) public initializer {
    _operator = _msgSender();
    __ERC721_init(name, symbol);
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

  function setBaseURI(string memory baseTokenURI) external {
    require(_operator == _msgSender(), "ERC721: caller is not operator");

    _setBaseURI(baseTokenURI);
  }

  function mint(address to) public returns (uint256) {
    require(_operator == _msgSender(), "ERC721: caller is not operator");

    _tokenIdTracker.increment();
    uint256 tokenId = _tokenIdTracker.current();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, tokenId.toString());
    return tokenId;
  }

  function burn(uint256 tokenId) public {
    require(
      _isApprovedOrOwner(_msgSender(), tokenId),
      "ERC721: caller is not owner nor approved"
    );
    _burn(tokenId);
  }
}
