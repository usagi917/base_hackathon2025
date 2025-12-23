// Contract addresses (prefer V2). Set these after deploying:
// - NEXT_PUBLIC_REGRET_VAULT_V2_ADDRESS
// - NEXT_PUBLIC_JUDGMENT_SBT_ADDRESS
export const REGRET_VAULT_ADDRESS = (process.env.NEXT_PUBLIC_REGRET_VAULT_V2_ADDRESS ||
  process.env.NEXT_PUBLIC_REGRET_VAULT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const JUDGMENT_SBT_ADDRESS = (process.env.NEXT_PUBLIC_JUDGMENT_SBT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const REGRET_VAULT_ABI = [
    {
        "type": "function",
        "name": "deposit",
        "inputs": [
            { "name": "message", "type": "string", "internalType": "string" },
            { "name": "asset", "type": "address", "internalType": "address" },
            { "name": "amount", "type": "uint256", "internalType": "uint256" }
        ],
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
                "internalType": "struct RegretVaultV2.Apology",
                "components": [
                    { "name": "sender", "type": "address", "internalType": "address" },
                    { "name": "amountDeposited", "type": "uint256", "internalType": "uint256" },
                    { "name": "asset", "type": "address", "internalType": "address" },
                    { "name": "message", "type": "string", "internalType": "string" },
                    { "name": "outcome", "type": "uint8", "internalType": "enum RegretVaultV2.Outcome" },
                    { "name": "depositedAt", "type": "uint256", "internalType": "uint256" },
                    { "name": "resolver", "type": "address", "internalType": "address" },
                    { "name": "resolvedAt", "type": "uint256", "internalType": "uint256" },
                    { "name": "settled", "type": "bool", "internalType": "bool" }
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
            { "name": "amountDeposited", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Resolved",
        "inputs": [
            { "name": "id", "type": "uint256", "indexed": true, "internalType": "uint256" },
            { "name": "outcome", "type": "uint8", "indexed": false, "internalType": "enum RegretVaultV2.Outcome" },
            { "name": "resolver", "type": "address", "indexed": true, "internalType": "address" }
        ],
        "anonymous": false
    }
] as const;

export const JUDGMENT_SBT_ABI = [
  {
    "type": "function",
    "name": "tokenURI",
    "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownerOf",
    "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  }
] as const;
