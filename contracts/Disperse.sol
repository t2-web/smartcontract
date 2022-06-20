// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Disperse {
    function disperseEther(
        address[] memory recipients,
        uint256[] memory values
    ) external payable {
        for (uint256 i = 0; i < recipients.length; i++)
            payable(recipients[i]).transfer(values[i]);

        uint256 balance = address(this).balance;
        if (balance > 0)
            payable(msg.sender).transfer(balance);
    }

    function disperseToken(
        address token,
        address[] memory recipients,
        uint256[] memory values
    ) external {
        uint256 total = 0;
        for (uint256 i = 0; i < recipients.length; i++)
            total += values[i];

        require(IERC20(token).transferFrom(msg.sender, address(this), total));

        for (uint256 i = 0; i < recipients.length; i++) {
            require(IERC20(token).transfer(recipients[i], values[i]));
        }
    }

    function disperseTokenSimple(
        address token,
        address[] memory recipients,
        uint256[] memory values
    ) external {
        for (uint256 i = 0; i < recipients.length; i++) {
            require(IERC20(token).transferFrom(msg.sender, recipients[i], values[i]));
        }
    }
}