// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {RegretVault} from "../src/RegretVault.sol";

contract RegretVaultTest is Test {
    RegretVault public vault;
    address public sinner = address(0x1);
    address public victim = address(0x2);

    function setUp() public {
        vault = new RegretVault();
        vm.deal(sinner, 100 ether);
        vm.deal(victim, 0 ether);
    }

    function test_Deposit() public {
        vm.prank(sinner);
        uint256 id = vault.deposit{value: 1 ether}("Sorry");
        
        assertEq(id, 0);
        (address sender, uint256 amount, string memory message, RegretVault.Outcome outcome, ) = vault.apologies(0);
        assertEq(sender, sinner);
        assertEq(amount, 1 ether);
        assertEq(message, "Sorry");
        assertEq(uint(outcome), uint(RegretVault.Outcome.Pending));
    }

    function test_Forgive() public {
        vm.prank(sinner);
        uint256 id = vault.deposit{value: 1 ether}("Sorry");

        uint256 preBalance = victim.balance;
        
        vm.prank(victim);
        vault.resolve(id, 1); // 1 = Forgive

        assertEq(victim.balance, preBalance + 1 ether);
        (, , , RegretVault.Outcome outcome, ) = vault.apologies(0);
        assertEq(uint(outcome), uint(RegretVault.Outcome.Forgiven));
    }

    function test_Reject() public {
        vm.prank(sinner);
        uint256 id = vault.deposit{value: 1 ether}("Sorry");

        uint256 preBalance = sinner.balance; // after deposit, balance is 99
        
        vm.prank(victim);
        vault.resolve(id, 2); // 2 = Reject

        assertEq(sinner.balance, preBalance + 1 ether);
        (, , , RegretVault.Outcome outcome, ) = vault.apologies(0);
        assertEq(uint(outcome), uint(RegretVault.Outcome.Rejected));
    }

    function test_Punish() public {
        vm.prank(sinner);
        uint256 id = vault.deposit{value: 1 ether}("Sorry");

        uint256 preBurnBalance = address(0).balance;
        
        vm.prank(victim);
        vault.resolve(id, 3); // 3 = Punish

        // address(0) balance should increase
        assertEq(address(0).balance, preBurnBalance + 1 ether);
        (, , , RegretVault.Outcome outcome, ) = vault.apologies(0);
        assertEq(uint(outcome), uint(RegretVault.Outcome.Punished));
    }
}
