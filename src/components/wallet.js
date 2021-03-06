import React, { useEffect, useState, useCallback } from "react";
import { chainID } from "../../config";
import { useWallet, UseWalletProvider } from "use-wallet";
import BasisCash from "./BasisCash";
import Bank from "./Bank";
import approveToken from "./approve";
import "../styles.css";
import { ethers } from "ethers";
import Bonds from "./Bonds";
import Boardroom from "./Boardroom";

function WalletProvider() {
  const wallet = useWallet();

  return (
    <>
      <div className="wallet">
        <h2 align="center">Connect to Wallet</h2>
        <p align="center">
          Wallet status:{" "}
          {wallet.status === "error" ? (
            <span>please connect to the mainnet</span>
          ) : (
            <span>{wallet.status}</span>
          )}
        </p>
        {wallet.status === "connected" ? (
          <div>
            <div align="center">
              <p>Account: {wallet.account}</p>
              <button className="btn2" onClick={() => wallet.reset()}>
                Disconnect
              </button>
            </div>
            <Bank wallet={wallet} token="BAC_DAI-UNI-LPv2" />
            <Bank wallet={wallet} token="BAS_DAI-UNI-LPv2" />
            <Bonds wallet={wallet} />
            <Boardroom wallet={wallet} />
          </div>
        ) : (
          <div align="center">
            <button className="btn2" onClick={() => wallet.connect()}>
              Connect to MetaMask
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
