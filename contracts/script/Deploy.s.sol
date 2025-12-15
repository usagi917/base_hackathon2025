// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {RegretVault} from "../src/RegretVault.sol";
import {RegretVaultV2} from "../src/RegretVaultV2.sol";
import {RegretJudgmentSBT} from "../src/RegretJudgmentSBT.sol";

contract Deploy is Script {
    function run() public {
        vm.startBroadcast();

        // Legacy (V1)
        RegretVault legacy = new RegretVault();
        console.log("RegretVault (legacy) deployed to:", address(legacy));

        // V2 + SBT
        RegretJudgmentSBT sbt = new RegretJudgmentSBT(unicode"Proof of Regret — Judgment", "PORJ");
        RegretVaultV2 vaultV2 = new RegretVaultV2(address(sbt));
        sbt.setVault(address(vaultV2));

        console.log("RegretJudgmentSBT deployed to:", address(sbt));
        console.log("RegretVaultV2 deployed to:", address(vaultV2));

        vm.stopBroadcast();
    }
}
