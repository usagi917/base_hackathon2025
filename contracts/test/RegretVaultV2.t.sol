// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {RegretVaultV2} from "../src/RegretVaultV2.sol";
import {RegretJudgmentSBT} from "../src/RegretJudgmentSBT.sol";

contract RegretVaultV2Test is Test {
    RegretJudgmentSBT public sbt;
    RegretVaultV2 public vault;

    address public sinner = address(0x1);
    address public judge = address(0x2);

    function setUp() public {
        sbt = new RegretJudgmentSBT(unicode"Proof of Regret — Judgment", "PORJ");
        vault = new RegretVaultV2(address(sbt));
        sbt.setVault(address(vault));

        vm.deal(sinner, 100 ether);
        vm.deal(judge, 0 ether);
    }

    function test_Deposit_EnforcesMessageLimit() public {
        bytes memory tooLong = new bytes(301);
        for (uint256 i = 0; i < tooLong.length; i++) {
            tooLong[i] = bytes1(uint8(97));
        }

        vm.prank(sinner);
        vm.expectRevert(bytes("Message too long"));
        vault.deposit{value: 1 ether}(string(tooLong));
    }

    function test_Resolve_Forgive_MintsSBTToJudge() public {
        vm.prank(sinner);
        uint256 id = vault.deposit{value: 1 ether}("Sorry");

        uint256 preJudge = judge.balance;
        vm.prank(judge);
        vault.resolve(id, 1);

        assertEq(judge.balance, preJudge + 1 ether);
        assertEq(sbt.ownerOf(id), judge);
    }

    function test_SBT_IsSoulbound() public {
        vm.prank(sinner);
        uint256 id = vault.deposit{value: 1 ether}("Sorry");

        vm.prank(judge);
        vault.resolve(id, 2);

        vm.expectRevert(RegretJudgmentSBT.Soulbound.selector);
        sbt.transferFrom(judge, sinner, id);

        vm.expectRevert(RegretJudgmentSBT.Soulbound.selector);
        sbt.approve(sinner, id);
    }
}
