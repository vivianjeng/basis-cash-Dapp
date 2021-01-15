import React, { Component, useEffect } from "react";
import approveToken from "./approve";
import BasisCash from "./BasisCash";
import { ethers, BigNumber } from "ethers";

const APPROVE_AMOUNT = ethers.constants.MaxUint256;

class Bonds extends Component {
  constructor(props) {
    super(props);
    this.state = { purchaseAmount: "", redeemAmount: "" };
    this.basis = new BasisCash();
    this.basis.unlockWallet(
      this.props.wallet.ethereum,
      this.props.wallet.account
    );

    this.handleChangePurchase = this.handleChangePurchase.bind(this);
    this.handleChangeRedeem = this.handleChangeRedeem.bind(this);
    this.handlePurchase = this.handlePurchase.bind(this);
    this.handleRedeem = this.handleRedeem.bind(this);
  }

  handleChangePurchase(event) {
    this.setState({ purchaseAmount: event.target.value });
  }

  handleChangeRedeem(event) {
    this.setState({ redeemAmount: event.target.value });
  }

  handlePurchase(event) {
    this.basis.buyBonds(BigNumber.from(this.state.purchaseAmount));
    event.preventDefault();
  }

  handleRedeem(event) {
    this.basis.redeemBonds(BigNumber.from(this.state.redeemAmount));
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div className="card2">
          <h2>Basis Cash</h2>
          <h3>Approve</h3>
          <button
            className="btn"
            onClick={() => approveToken(this.props.wallet, "BAC")}
          >
            Approve Basis Cash
          </button>
          <h3>Purchase</h3>
          <form onSubmit={this.handlePurchase}>
            <label>
              Amount:
              <input
                className="input"
                type="text input"
                value={this.state.purchaseAmount}
                onChange={this.handleChangePurchase}
              />
            </label>
            <input
              className="btn"
              type="submit"
              value="Purchase from BAC to BAB"
            ></input>
          </form>
          <h3>Redeem</h3>
          <form onSubmit={this.handleRedeem}>
            <label>
              Amount:
              <input
                className="input"
                type="text"
                value={this.state.redeemAmount}
                onChange={this.handleChangeRedeem}
              />
            </label>
            <input
              className="btn"
              type="submit"
              value="Redeem from BAB to BAC"
            ></input>
          </form>
        </div>
      </div>
    );
  }
}

export default Bonds;
