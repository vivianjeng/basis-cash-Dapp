import React, { Component } from "react";
import WalletProvider from "./components/wallet";
import contractProvider from "./components/contract";
import { cashAddress, bondAddress, shareAddress } from "../../config";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { cash: "", bond: "", share: "" };
    this.displayContractValue();
  }

  displayContractValue() {
    const contractValue = async () => {
      const cashContract = new contractProvider(cashAddress);
      const bondContract = new contractProvider(bondAddress);
      const shareContract = new contractProvider(shareAddress);
      const cashValue = await cashContract.displayTotalSupply();
      const bondValue = await bondContract.displayTotalSupply();
      const shareValue = await shareContract.displayTotalSupply();
      this.setState({ cash: cashValue, bond: bondValue, share: shareValue });
    };
    contractValue();
  }

  render() {
    return (
      <div>
        <h1>Hello</h1>
        <WalletProvider />
        <h2>Basis Cash Total Supply: {this.state.cash}</h2>
        <h2>Basis Cash Total Supply: {this.state.bond}</h2>
        <h2>Basis Cash Total Supply: {this.state.share}</h2>
      </div>
    );
  }
}

export default App;
