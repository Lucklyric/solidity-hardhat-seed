//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;
pragma abicoder v2;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract GreeterImplV2 is AccessControlUpgradeable, UUPSUpgradeable {
    string greeting;
    uint256 public count;
    uint256 public count2;

    function initialize(string memory _greeting) public initializer {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function getCount() public view returns (uint256) {
        return count + count2;
    }

    function setCount(uint256 _count) public {
        count = _count;
        count2 = count * 2;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }

    function _authorizeUpgrade(address) internal view override {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "require admin permission to do upgrades");
    }
}
