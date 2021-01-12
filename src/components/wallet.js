import React, { useEffect, useState, useCallback } from "react";
import { chainID } from "../../config";
import { useWallet, UseWalletProvider } from "use-wallet";
import BasisCash from "./BasisCash";
import { ethers } from "ethers";

function unlockWallet(wallet) {
  wallet.connect();
}

function connectContracts(wallet) {
  const basis = new BasisCash();
  basis.unlockWallet(wallet.ethereum, wallet.account);
}

function WalletProvider() {
  const wallet = useWallet();
  // console.log(wallet.status);

  return (
    <>
      <h1>Wallet</h1>
      {wallet.status === "connected" ? (
        <div>
          <div>Account: {wallet.account}</div>
          <div>Balance: {wallet.balance}</div>
          <button onClick={() => connectContracts(wallet)}>
            Connect contracts
          </button>
          <button onClick={() => wallet.reset()}>Disconnect</button>
        </div>
      ) : (
        <div>
          Connect:
          <button onClick={() => unlockWallet(wallet)}>MetaMask</button>
        </div>
      )}
    </>
  );
}

// Wrap everything in <UseWalletProvider />
export default () => (
  <UseWalletProvider chainId={chainID}>
    <WalletProvider />
  </UseWalletProvider>
);
