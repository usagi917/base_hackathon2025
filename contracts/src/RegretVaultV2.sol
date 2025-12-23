// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRegretJudgmentSBT {
    function mintToJudge(address judge, uint256 tokenId) external;
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract RegretVaultV2 {
    enum Outcome { Pending, Forgiven, Rejected, Punished }

    struct Apology {
        address sender;
        uint256 amountDeposited;
        address asset;
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

    address public constant NATIVE_TOKEN = address(0);

    event Deposited(uint256 indexed id, address indexed sender, uint256 amountDeposited);
    event Resolved(uint256 indexed id, Outcome outcome, address indexed resolver);
    event SBTMinted(uint256 indexed id, uint256 indexed tokenId, address indexed judge);

    constructor(address sbtAddress) {
        require(sbtAddress != address(0), "Zero SBT");
        judgmentSBT = IRegretJudgmentSBT(sbtAddress);
    }

    function deposit(string calldata message, address asset, uint256 amount) external payable returns (uint256) {
        require(bytes(message).length > 0, "Message required");
        require(bytes(message).length <= 300, "Message too long");

        bool isNative = asset == NATIVE_TOKEN;
        uint256 depositAmount = isNative ? msg.value : amount;

        require(depositAmount > 0, "Must deposit something");

        if (isNative) {
            require(amount == 0 || amount == msg.value, "Native amount mismatch");
        } else {
            require(msg.value == 0, "Do not send native token");
            _safeTransferFrom(IERC20(asset), msg.sender, address(this), amount);
        }

        uint256 id = nextId++;
        apologies[id] = Apology({
            sender: msg.sender,
            amountDeposited: depositAmount,
            asset: asset,
            message: message,
            outcome: Outcome.Pending,
            depositedAt: block.timestamp,
            resolver: address(0),
            resolvedAt: 0,
            settled: false
        });

        emit Deposited(id, msg.sender, depositAmount);
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
        address asset = apology.asset;

        // Interactions
        if (outcome == Outcome.Forgiven) {
            _payout(asset, msg.sender, amount);
        } else if (outcome == Outcome.Rejected) {
            _payout(asset, apology.sender, amount);
        } else if (outcome == Outcome.Punished) {
            _payout(asset, address(0), amount);
        }

        judgmentSBT.mintToJudge(msg.sender, id);

        emit Resolved(id, outcome, msg.sender);
        emit SBTMinted(id, id, msg.sender);
    }

    function getApology(uint256 id) external view returns (Apology memory) {
        return apologies[id];
    }

    function _payout(address asset, address to, uint256 amount) internal {
        if (asset == NATIVE_TOKEN) {
            (bool success, ) = payable(to).call{value: amount}("");
            require(success, "Transfer failed");
        } else {
            _safeTransfer(IERC20(asset), to, amount);
        }
    }

    function _safeTransferFrom(IERC20 token, address from, address to, uint256 amount) internal {
        (bool success, bytes memory data) = address(token).call(
            abi.encodeWithSelector(token.transferFrom.selector, from, to, amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Transfer failed");
    }

    function _safeTransfer(IERC20 token, address to, uint256 amount) internal {
        (bool success, bytes memory data) = address(token).call(
            abi.encodeWithSelector(token.transfer.selector, to, amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Transfer failed");
    }
}
