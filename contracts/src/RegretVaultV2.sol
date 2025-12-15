// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRegretJudgmentSBT {
    function mintToJudge(address judge, uint256 tokenId) external;
}

contract RegretVaultV2 {
    enum Outcome { Pending, Forgiven, Rejected, Punished }

    struct Apology {
        address sender;
        uint256 amountDeposited;
        string message;
        Outcome outcome;
        uint256 depositedAt;
        address resolver;
        uint256 resolvedAt;
        bool settled;
    }

    uint256 public nextId;
    mapping(uint256 => Apology) public apologies;

    IRegretJudgmentSBT public immutable judgmentSBT;

    event Deposited(uint256 indexed id, address indexed sender, uint256 amountDeposited);
    event Resolved(uint256 indexed id, Outcome outcome, address indexed resolver);
    event SBTMinted(uint256 indexed id, uint256 indexed tokenId, address indexed judge);

    constructor(address sbtAddress) {
        require(sbtAddress != address(0), "Zero SBT");
        judgmentSBT = IRegretJudgmentSBT(sbtAddress);
    }

    function deposit(string calldata message) external payable returns (uint256) {
        require(msg.value > 0, "Must deposit something");
        require(bytes(message).length > 0, "Message required");
        require(bytes(message).length <= 300, "Message too long");

        uint256 id = nextId++;
        apologies[id] = Apology({
            sender: msg.sender,
            amountDeposited: msg.value,
            message: message,
            outcome: Outcome.Pending,
            depositedAt: block.timestamp,
            resolver: address(0),
            resolvedAt: 0,
            settled: false
        });

        emit Deposited(id, msg.sender, msg.value);
        return id;
    }

    function resolve(uint256 id, uint8 decision) external {
        Apology storage apology = apologies[id];
        require(apology.depositedAt != 0, "Not found");
        require(apology.outcome == Outcome.Pending, "Already resolved");
        require(!apology.settled, "Already settled");

        require(decision >= 1 && decision <= 3, "Invalid decision");
        Outcome outcome = Outcome(decision);

        // Effects
        apology.outcome = outcome;
        apology.resolver = msg.sender;
        apology.resolvedAt = block.timestamp;
        apology.settled = true;

        uint256 amount = apology.amountDeposited;

        // Interactions
        if (outcome == Outcome.Forgiven) {
            (bool success, ) = payable(msg.sender).call{value: amount}("");
            require(success, "Transfer failed");
        } else if (outcome == Outcome.Rejected) {
            (bool success, ) = payable(apology.sender).call{value: amount}("");
            require(success, "Transfer failed");
        } else if (outcome == Outcome.Punished) {
            (bool success, ) = payable(address(0)).call{value: amount}("");
            require(success, "Burn failed");
        }

        judgmentSBT.mintToJudge(msg.sender, id);

        emit Resolved(id, outcome, msg.sender);
        emit SBTMinted(id, id, msg.sender);
    }

    function getApology(uint256 id) external view returns (Apology memory) {
        return apologies[id];
    }
}

