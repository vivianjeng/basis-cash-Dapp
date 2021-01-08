import React from "react";
import "./styles.css";
import { walletProvider } from "./wallet/index";

let [wallet, provider] = walletProvider();
let key = provider.apiKey;
let addr = wallet.address;

export default function App() {
  return (
    <div className="App">
      <h2>wallet address: {addr}</h2>
      <h2>infuraKey key: {key}</h2>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
