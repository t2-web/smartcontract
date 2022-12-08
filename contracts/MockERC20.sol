// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MockERC20 is Ownable, ERC20Burnable {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

  function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
  }
}
