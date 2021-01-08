import React from "react";
import { ethers, Wallet } from "ethers";
import { infuraKey, mnemonic } from "../../config";

export function walletProvider() {
  let provider = new ethers.providers.InfuraProvider("homestead", infuraKey);
  let wallet = Wallet.fromMnemonic(mnemonic);
  let walletInfo = wallet.connect(provider);

  return [walletInfo, provider];
}
