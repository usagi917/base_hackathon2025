// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {RegretVault} from "../src/RegretVault.sol";

contract Deploy is Script {
    function run() public {
        vm.startBroadcast();

        RegretVault vault = new RegretVault();
        console.log("RegretVault deployed to:", address(vault));

        vm.stopBroadcast();
    }
}
