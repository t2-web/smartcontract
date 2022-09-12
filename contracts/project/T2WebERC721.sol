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

  uint256 private _salt =
    uint256(keccak256(abi.encodePacked("Welc0me_2_ToW3b")));

  mapping(uint256 => bool) private _mintedIds;

  string private _baseTokenURI;
  uint256 private _mintedCount;

  uint256 public totalSupply;

  function initialize(
    string memory name_,
    string memory symbol_,
    string memory baseTokenURI_,
    uint256 totalSupply_
  ) public initializer {
    __ERC721_init(name_, symbol_);

    totalSupply = totalSupply_;
    _mintedCount = 0;
    _setBaseURI(baseTokenURI_);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(OPERATOR_ROLE, msg.sender);
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
    uint256 remainingCount = totalSupply - _mintedCount;
    uint256[] memory remainingIds = new uint256[](remainingCount);
    uint256 j = 0;
    for (uint256 i = 1; i <= totalSupply; i++) {
      if (!_mintedIds[i]) {
        remainingIds[j] = i;
        j++;
      }
    }

    uint256 idx = _randomNumber(
      uint256(keccak256(abi.encodePacked(remainingCount)))
    ) % remainingCount;

    uint256 tokenId = remainingIds[idx];

    require(!_mintedIds[tokenId], "ERC721: already exists");

    _safeMint(to, tokenId);
    _setTokenURI(tokenId, tokenId.toString());

    _mintedIds[tokenId] = true;
    _mintedCount = _mintedCount + 1;

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

  function _randomNumber(uint256 sugar) internal view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, _salt, sugar)));
  }
}
