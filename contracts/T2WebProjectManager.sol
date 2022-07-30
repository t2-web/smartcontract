// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "./lib/Signature.sol";

contract T2WebProjectManager is AccessControlUpgradeable {

  using Signature for bytes32;

  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  struct ProjectData {
    mapping(address => bool) members;
    bytes32 adminRole;
  }
}
