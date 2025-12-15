// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface IERC721 is IERC165 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    function balanceOf(address owner) external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function approve(address to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address);
    function setApprovalForAll(address operator, bool approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
}

interface IERC721Metadata is IERC721 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);
}

interface IERC721Receiver {
    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4);
}

contract RegretJudgmentSBT is IERC721Metadata {
    error NotOwner();
    error NotVault();
    error VaultAlreadySet();
    error BaseURIFrozen();
    error TokenDoesNotExist();
    error Soulbound();

    string private _name;
    string private _symbol;

    address public owner;
    address public vault;

    string public baseURI;
    bool public baseURIFrozen;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyVault() {
        if (msg.sender != vault) revert NotVault();
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function setVault(address vault_) external onlyOwner {
        if (vault != address(0)) revert VaultAlreadySet();
        vault = vault_;
    }

    function setBaseURI(string calldata baseURI_) external onlyOwner {
        if (baseURIFrozen) revert BaseURIFrozen();
        baseURI = baseURI_;
    }

    function freezeBaseURI() external onlyOwner {
        baseURIFrozen = true;
    }

    function mintToJudge(address judge, uint256 tokenId) external onlyVault {
        _safeMint(judge, tokenId);
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function balanceOf(address owner_) external view returns (uint256) {
        require(owner_ != address(0), "Zero owner");
        return _balances[owner_];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _owners[tokenId];
        if (tokenOwner == address(0)) revert TokenDoesNotExist();
        return tokenOwner;
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        ownerOf(tokenId);
        return string(abi.encodePacked(baseURI, _toString(tokenId)));
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return
            interfaceId == 0x01ffc9a7 || // ERC165
            interfaceId == 0x80ac58cd || // ERC721
            interfaceId == 0x5b5e139f;   // ERC721Metadata
    }

    // --- Soulbound: all approvals and transfers are disabled ---

    function approve(address, uint256) external pure {
        revert Soulbound();
    }

    function getApproved(uint256) external pure returns (address) {
        return address(0);
    }

    function setApprovalForAll(address, bool) external pure {
        revert Soulbound();
    }

    function isApprovedForAll(address, address) external pure returns (bool) {
        return false;
    }

    function transferFrom(address, address, uint256) external pure {
        revert Soulbound();
    }

    function safeTransferFrom(address, address, uint256) external pure {
        revert Soulbound();
    }

    function safeTransferFrom(address, address, uint256, bytes calldata) external pure {
        revert Soulbound();
    }

    // --- Internals ---

    function _safeMint(address to, uint256 tokenId) internal {
        _mint(to, tokenId);
        _checkOnERC721Received(address(0), to, tokenId, "");
    }

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "Zero to");
        require(_owners[tokenId] == address(0), "Already minted");

        _owners[tokenId] = to;
        _balances[to] += 1;

        emit Transfer(address(0), to, tokenId);
    }

    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory data) private {
        if (to.code.length == 0) return;
        bytes4 retval = IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data);
        require(retval == IERC721Receiver.onERC721Received.selector, "Unsafe receiver");
    }

    function _toString(uint256 value) private pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

