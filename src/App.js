import React, { Component } from "react";
import WalletProvider from "./components/wallet";
import BasisCash from "./components/BasisCash";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { cash: "", bond: "", share: "", cashprice: "" };
    this.displayContractValue();
  }

  displayContractValue() {
    const basisCash = new BasisCash();
    const contractValue = async () => {
      const bondValue = await basisCash.BAB.displayTotalSupply();
      const cashState = await basisCash.getCashStatFromUniswap();
      const shareState = await basisCash.getShareStat();
      this.setState({
        cash: cashState.totalSupply,
        bond: bondValue,
        share: shareState.totalSupply,
        sharePrice: shareState.priceInDAI,
        cashprice: cashState.priceInDAI
      });
    };
    contractValue();
  }

  render() {
    return (
      <div>
        <h1>Hello</h1>
        <WalletProvider />
        <h2>Basis Cash Total Supply: {this.state.cash}</h2>
        <h2>Basis Cash State From Uniswap: {this.state.cashprice}</h2>
        <h2>Basis Bond Supply: {this.state.bond}</h2>
        <h2>Basis Share Supply: {this.state.share}</h2>
        <h2>Basis Share State From Uniswap: {this.state.sharePrice}</h2>
      </div>
    );
  }
}

export default App;
