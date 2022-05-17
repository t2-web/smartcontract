// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiNFT is ERC1155URIStorage, Ownable {

  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdTracker;

  constructor(string memory baseTokenURI, string memory uri) ERC1155(uri) {
    _setBaseURI(baseTokenURI);
  }

  function currentId() public view virtual returns (uint256) {
    return _tokenIdTracker.current();
  }

  function mintItem(address to, string memory tokenURI, uint256 amount) public returns (uint256) {
    _tokenIdTracker.increment();
    uint256 tokenId = _tokenIdTracker.current();
    _mint(to, tokenId, amount, "");
    _setURI(tokenId, tokenURI);
    return tokenId;
  }

  function burn(
    address account,
    uint256 id,
    uint256 value
  ) public {
    require(
      account == _msgSender() || isApprovedForAll(account, _msgSender()),
        "ERC1155: caller is not owner nor approved"
    );

    _burn(account, id, value);
  }

  function burnBatch(
    address account,
    uint256[] memory ids,
    uint256[] memory values
  ) public {
    require(
      account == _msgSender() || isApprovedForAll(account, _msgSender()),
        "ERC1155: caller is not owner nor approved"
    );

    _burnBatch(account, ids, values);
  }
}
