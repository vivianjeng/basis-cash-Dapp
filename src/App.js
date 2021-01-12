import React, { Component, useEffect } from "react";
import WalletProvider from "./components/wallet";
import BasisCash from "./components/BasisCash";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.displayContractValue();
  }

  displayContractValue() {
    const basisCash = new BasisCash();
    const contractValue = async () => {
      const [cashState, shareState, bondState] = await Promise.all([
        basisCash.getCashStatFromUniswap(),
        basisCash.getShareStat(),
        basisCash.getBondStat()
      ]);
      this.setState({
        cash: cashState.totalSupply,
        cashprice: cashState.priceInDAI,
        bond: bondState.totalSupply,
        bondPrice: bondState.priceInDAI,
        share: shareState.totalSupply,
        sharePrice: shareState.priceInDAI
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
        <h2>Basis Share Supply: {this.state.share}</h2>
        <h2>Basis Share State From Uniswap: {this.state.sharePrice}</h2>
        <h2>Basis Bond Supply: {this.state.bond}</h2>
        <h2>Basis Bond State From Uniswap: {this.state.bondPrice}</h2>
      </div>
    );
  }
}

export default App;
