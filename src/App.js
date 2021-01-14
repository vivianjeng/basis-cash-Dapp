import React, { Component, useEffect } from "react";
import WalletProvider from "./components/wallet";
import BasisCash from "./components/BasisCash";
import "./styles.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cash: "loading",
      cashprice: "loading",
      bond: "loading",
      bondPrice: "loading",
      share: "loading",
      sharePrice: "loading"
    };
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
        <h1>🍵 Basis Cash DApp</h1>
        <div className="card">
          <h2>Basis Cash</h2>
          <p>Current Price: {this.state.cashprice} </p>
          <p>Circulating Supply: {this.state.cash}</p>
        </div>
        <div className="card">
          <h2>Basis Share</h2>
          <p>Current Price: {this.state.sharePrice} </p>
          <p>Total Supply: {this.state.share}</p>
        </div>
        <div className="card">
          <h2>Basis Bond</h2>
          <p>Current Price: {this.state.bondPrice} </p>
          <p>Total Supply: {this.state.bond}</p>
        </div>
        <WalletProvider />
      </div>
    );
  }
}

export default App;
