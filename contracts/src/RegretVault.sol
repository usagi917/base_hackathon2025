// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RegretVault {
    enum Outcome { Pending, Forgiven, Rejected, Punished }

    struct Apology {
        address sender;
        uint256 amount;
        string message;
        Outcome outcome;
        uint256 timestamp;
    }

    uint256 public nextId;
    mapping(uint256 => Apology) public apologies;

    event Deposited(uint256 indexed id, address indexed sender, uint256 amount);
    event Resolved(uint256 indexed id, Outcome outcome, address indexed resolver);

    function deposit(string calldata message) external payable returns (uint256) {
        require(msg.value > 0, "Must deposit something");
        
        uint256 id = nextId++;
        apologies[id] = Apology({
            sender: msg.sender,
            amount: msg.value,
            message: message,
            outcome: Outcome.Pending,
            timestamp: block.timestamp
        });

        emit Deposited(id, msg.sender, msg.value);
        return id;
    }

    function resolve(uint256 id, uint8 decision) external {
        Apology storage apology = apologies[id];
        require(apology.outcome == Outcome.Pending, "Already resolved");
        // Simple MVP: Anyone who calls this function acts as the "Victim" for this logic.
        // It relies on the link being kept secret.

        require(decision >= 1 && decision <= 3, "Invalid decision");
        Outcome outcome = Outcome(decision);
        
        apology.outcome = outcome;
        uint256 amount = apology.amount;
        apology.amount = 0; // Reentrancy protection

        if (outcome == Outcome.Forgiven) {
            // Victim forgives -> Victim (msg.sender) gets the money
            (bool success, ) = payable(msg.sender).call{value: amount}("");
            require(success, "Transfer failed");
        } else if (outcome == Outcome.Rejected) {
            // Victim rejects -> Money goes back to Sinner
            (bool success, ) = payable(apology.sender).call{value: amount}("");
            require(success, "Transfer failed");
        } else if (outcome == Outcome.Punished) {
            // Victim punishes -> Money is burned (sent to 0x0)
            (bool success, ) = payable(address(0)).call{value: amount}("");
            require(success, "Burn failed");
        }

        emit Resolved(id, outcome, msg.sender);
    }
    
    function getApology(uint256 id) external view returns (Apology memory) {
        return apologies[id];
    }
}
