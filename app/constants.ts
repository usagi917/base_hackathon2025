// コントラクトアドレス（環境変数から取得、なければデフォルト値を使用）
export const REGRET_VAULT_ADDRESS = (process.env.NEXT_PUBLIC_REGRET_VAULT_ADDRESS || "0xd0d4044c7e51e96002dd143bbc441cd6b1eafdaa") as `0x${string}`;

export const REGRET_VAULT_ABI = [
    {
        "type": "function",
        "name": "deposit",
        "inputs": [{ "name": "message", "type": "string", "internalType": "string" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "resolve",
        "inputs": [
            { "name": "id", "type": "uint256", "internalType": "uint256" },
            { "name": "decision", "type": "uint8", "internalType": "uint8" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getApology",
        "inputs": [{ "name": "id", "type": "uint256", "internalType": "uint256" }],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct RegretVault.Apology",
                "components": [
                    { "name": "sender", "type": "address", "internalType": "address" },
                    { "name": "amount", "type": "uint256", "internalType": "uint256" },
                    { "name": "message", "type": "string", "internalType": "string" },
                    { "name": "outcome", "type": "uint8", "internalType": "enum RegretVault.Outcome" },
                    { "name": "timestamp", "type": "uint256", "internalType": "uint256" }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "Deposited",
        "inputs": [
            { "name": "id", "type": "uint256", "indexed": true, "internalType": "uint256" },
            { "name": "sender", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Resolved",
        "inputs": [
            { "name": "id", "type": "uint256", "indexed": true, "internalType": "uint256" },
            { "name": "outcome", "type": "uint8", "indexed": false, "internalType": "enum RegretVault.Outcome" },
            { "name": "resolver", "type": "address", "indexed": true, "internalType": "address" }
        ],
        "anonymous": false
    }
] as const;
