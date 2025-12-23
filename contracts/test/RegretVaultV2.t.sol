// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {RegretVaultV2} from "../src/RegretVaultV2.sol";
import {RegretJudgmentSBT} from "../src/RegretJudgmentSBT.sol";

contract RegretVaultV2Test is Test {
    RegretJudgmentSBT public sbt;
    RegretVaultV2 public vault;
    MockToken public usdc;

    address public sinner = address(0x1);
    address public judge = address(0x2);

    function setUp() public {
        sbt = new RegretJudgmentSBT(unicode"Proof of Regret — Judgment", "PORJ");
        vault = new RegretVaultV2(address(sbt));
        sbt.setVault(address(vault));
        usdc = new MockToken("USD Coin", "USDC", 6);

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
        vault.deposit{value: 1 ether}(string(tooLong), vault.NATIVE_TOKEN(), 0);
    }

    function test_Resolve_Forgive_MintsSBTToJudge() public {
        vm.prank(sinner);
        uint256 id = vault.deposit{value: 1 ether}("Sorry", vault.NATIVE_TOKEN(), 1 ether);

        uint256 preJudge = judge.balance;
        vm.prank(judge);
        vault.resolve(id, 1);

        assertEq(judge.balance, preJudge + 1 ether);
        assertEq(sbt.ownerOf(id), judge);
    }

    function test_Deposit_Erc20_TransfersTokenAndPayouts() public {
        uint256 amount = 50_000_000; // 50 USDC (6 decimals)
        usdc.mint(sinner, amount);

        vm.prank(sinner);
        usdc.approve(address(vault), amount);

        vm.prank(sinner);
        uint256 id = vault.deposit("Sorry", address(usdc), amount);

        assertEq(usdc.balanceOf(address(vault)), amount);

        vm.prank(judge);
        vault.resolve(id, 1);

        assertEq(usdc.balanceOf(judge), amount);
    }

    function test_SBT_IsSoulbound() public {
        vm.prank(sinner);
        uint256 id = vault.deposit{value: 1 ether}("Sorry", vault.NATIVE_TOKEN(), 1 ether);

        vm.prank(judge);
        vault.resolve(id, 2);

        vm.expectRevert(RegretJudgmentSBT.Soulbound.selector);
        sbt.transferFrom(judge, sinner, id);

        vm.expectRevert(RegretJudgmentSBT.Soulbound.selector);
        sbt.approve(sinner, id);
    }
}

contract MockToken is Test {
    string public name;
    string public symbol;
    uint8 public decimals;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        require(allowed >= amount, "insufficient allowance");
        allowance[from][msg.sender] = allowed - amount;
        _transfer(from, to, amount);
        return true;
    }

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        uint256 bal = balanceOf[from];
        require(bal >= amount, "insufficient balance");
        balanceOf[from] = bal - amount;
        balanceOf[to] += amount;
    }
}
