// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "../interfaces/IT2WebERC721.sol";

contract T2WebERC721 is
  IT2WebERC721,
  ERC721URIStorageUpgradeable,
  AccessControlUpgradeable
{
  using Strings for uint256;
  using Counters for Counters.Counter;

  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  Counters.Counter private _tokenIdTracker;

  string private _baseTokenURI;

  function initialize(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) public initializer {
    __ERC721_init(name, symbol);

    _setBaseURI(baseTokenURI);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(OPERATOR_ROLE, msg.sender);
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

  function setBaseURI(string memory baseTokenURI)
    external
    onlyRole(OPERATOR_ROLE)
  {
    _setBaseURI(baseTokenURI);
  }

  function mint(address to) public onlyRole(OPERATOR_ROLE) returns (uint256) {
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

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721Upgradeable, AccessControlUpgradeable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
