import React from "react";
import { chainID } from "../../config";
import { useWallet, UseWalletProvider } from "use-wallet";

function WalletProvider() {
  const wallet = useWallet();
  const blockNumber = wallet.getBlockNumber();

  return (
    <>
      <h1>Wallet</h1>
      {wallet.status === "connected" ? (
        <div>
          <div>Account: {wallet.account}</div>
          <div>Balance: {wallet.balance}</div>
          <button onClick={() => wallet.reset()}>disconnect</button>
        </div>
      ) : (
        <div>
          Connect:
          <button onClick={() => wallet.connect()}>MetaMask</button>
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
