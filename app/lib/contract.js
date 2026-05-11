import { ethers } from "ethers";

export const BMAS_ADDRESS = "0x42687A744104FF0ee93bA721a536E27309344535";
export const CHAIN_ID = 1; // Ethereum mainnet
export const GOAL_ETH = 2.937;
export const TARGET_POINTS = 720;
export const MAX_POINTS_PER_MINT = 15;
export const PUBLIC_RPC = "https://ethereum-rpc.publicnode.com";

export const BMAS_ABI = [
  "function mint() payable",
  "function totalRaised() view returns (uint256)",
  "function totalPointsSold() view returns (uint256)",
  "function nextTokenId() view returns (uint256)",
  "function deadline() view returns (uint256)",
  "function currentPointPrice() view returns (uint256)",
  "function costForPoints(uint256) view returns (uint256)",
  "function state() view returns (uint8)",
];

export function getReadContract() {
  const provider = new ethers.JsonRpcProvider(PUBLIC_RPC);
  return new ethers.Contract(BMAS_ADDRESS, BMAS_ABI, provider);
}

export function getWriteContract(signer) {
  return new ethers.Contract(BMAS_ADDRESS, BMAS_ABI, signer);
}
