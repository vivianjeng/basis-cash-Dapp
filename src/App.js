import React, { Component, useEffect } from "react";
import WalletProvider from "./components/wallet";
import BasisCash from "./components/BasisCash";
import "./styles.css";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

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
        <h1 className="App">Basis Cash DApp</h1>
        <WalletProvider />
        <div className="card">
          <p>Basis Cash Total Supply: </p>
          <h2>{this.state.cash}</h2>
          <p>Basis Cash State From Uniswap: </p>
          <h2>{this.state.cashprice}</h2>
        </div>
        <div className="card">
          <p>Basis Share Supply: </p>
          <h2>{this.state.share}</h2>
          <p>Basis Share State From Uniswap: </p>
          <h2>{this.state.sharePrice}</h2>
        </div>
        <div className="card">
          <p>Basis Bond Supply: </p>
          <h2>{this.state.bond}</h2>
          <p>Basis Bond State From Uniswap: </p>
          <h2>{this.state.bondPrice}</h2>
        </div>
      </div>
    );
  }
}

export default App;
