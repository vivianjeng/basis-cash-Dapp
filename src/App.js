import React from "react";
import WalletProvider from "./components/wallet";
import contractProvider from "./components/contract";
import { formatUnits } from "ethers/lib/utils";

export default function App() {
  let res = 0;
  let cash = new contractProvider();
  console.log(
    cash.displayTotalSupply().then(function (value) {
      console.log(value);
    })
  );
  return (
    <div>
      <h1>Hello</h1>
      <WalletProvider />
      <h2>Basis Cash Total Supply: {res}</h2>
    </div>
  );
}
