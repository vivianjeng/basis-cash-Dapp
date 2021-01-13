import React, { useEffect, useState, useCallback } from "react";
import { chainID } from "../../config";
import { useWallet, UseWalletProvider } from "use-wallet";
import BasisCash from "./BasisCash";
import approveToken from "./approve";
import "../styles.css";
import { ethers } from "ethers";

function approve(wallet, tokenName) {
  const basis = new BasisCash();
  basis.unlockWallet(wallet.ethereum, wallet.account);
  approveToken(basis, tokenName);
}

function WalletProvider() {
  const wallet = useWallet();
  console.log(ethers.constants.MaxUint256);

  return (
    <>
      <div align="center" className="wallet">
        <h2 align="center">Connect to Wallet</h2>
        <p align="center">Wallet status: {wallet.status}</p>
        {wallet.status === "connected" ? (
          <div align="center">
            <div>Account: {wallet.account}</div>
            <div>Balance: {wallet.balance}</div>
            <button className="btn" onClick={() => wallet.reset()}>
              Disconnect
            </button>
            <button
              className="btn"
              onClick={() => approve(wallet, "BAC_DAI-UNI-LPv2")}
            >
              Approve BAC_DAI-UNI-LPv2
            </button>
            <button
              className="btn"
              onClick={() => approve(wallet, "BAS_DAI-UNI-LPv2")}
            >
              Approve BAS_DAI-UNI-LPv2
            </button>
            <button className="btn" onClick={() => approve(wallet, "BAC")}>
              Approve Basis Cash
            </button>
            <button className="btn" onClick={() => approve(wallet, "BAS")}>
              Approve Basis Share
            </button>
          </div>
        ) : (
          <div align="center">
            Connect:
            <button className="btn" onClick={() => wallet.connect()}>
              MetaMask
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Wrap everything in <UseWalletProvider />
export default () => (
  <UseWalletProvider chainId={chainID}>
    <WalletProvider />
  </UseWalletProvider>
);
