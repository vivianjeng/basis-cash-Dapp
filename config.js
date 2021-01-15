import { ChainId } from "@uniswap/sdk";

export const infuraKey = "f5097d7ff5a142d3b59dfcb26a27ebc6";
export const chainID = ChainId.MAINNET;
export const cashAddress = "0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a";
export const shareAddress = "0xa7ED29B253D8B4E3109ce07c80fc570f81B63696";
export const bondAddress = "0xC36824905dfF2eAAEE7EcC09fCC63abc0af5Abc5";
export const DAI = ["0x6B175474E89094C44Da98b954EedeAC495271d0F", 18];
export const deployments = require("./deployments.mainnet.json");
export const externalTokens = {
  DAI: ["0x6B175474E89094C44Da98b954EedeAC495271d0F", 18],
  yCRV: ["0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8", 18],
  SUSD: ["0x57Ab1E02fEE23774580C119740129eAC7081e9D3", 18],
  USDC: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 6],
  USDT: ["0xdAC17F958D2ee523a2206206994597C13D831ec7", 6],
  "BAC_DAI-UNI-LPv2": ["0xd4405F0704621DBe9d4dEA60E128E0C3b26bddbD", 18],
  "BAS_DAI-UNI-LPv2": ["0x0379dA7a5895D13037B6937b109fA8607a659ADF", 18]
};
export const gasLimitMultiplier = 1.1;
