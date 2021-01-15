import React, { Component, useEffect } from "react";
import approveToken from "./approve";
import BasisCash from "./BasisCash";
import { ethers, BigNumber } from "ethers";

class Boardroom extends Component {
  constructor(props) {
    super(props);
    this.state = { withdrawAmount: "", stakeAmount: "" };
    this.basis = new BasisCash();
    this.basis.unlockWallet(
      this.props.wallet.ethereum,
      this.props.wallet.account
    );
    this.handleChangeWithdraw = this.handleChangeWithdraw.bind(this);
    this.handleChangeStake = this.handleChangeStake.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
    this.handleStake = this.handleStake.bind(this);
  }

  handleChangeWithdraw(event) {
    this.setState({ withdrawAmount: event.target.value });
  }

  handleChangeStake(event) {
    this.setState({ stakeAmount: event.target.value });
  }

  handleWithdraw(event) {
    this.basis.withdrawShareFromBoardroom(
      BigNumber.from(this.state.withdrawAmount)
    );
    event.preventDefault();
  }

  handleStake(event) {
    this.basis.stakeShareToBoardroom(BigNumber.from(this.state.stakeAmount));
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div className="card2">
          <h2>Boardroom</h2>
          <h3>Approve</h3>
          <button
            className="btn"
            onClick={() => approveToken(this.props.wallet, "BAS")}
          >
            Approve Basis Share
          </button>
          <h3>Harvets</h3>
          <button
            className="btn"
            onClick={() => this.basis.harvestCashFromBoardroom()}
          >
            Claim Reward
          </button>
          <h3>Exit</h3>
          <button
            className="btn"
            onClick={() => this.basis.exitFromBoardroom()}
          >
            Settle & Withdraw
          </button>
          <p>isOldBoardroomMember</p>
          <button
            className="btn"
            onClick={() => this.basis.exitFromBoardroom()}
          >
            Settle & Withdraw
          </button>
          <p>notOldBoardroomMember</p>
          <h3>Withdraw</h3>
          <form onSubmit={this.handleWithdraw}>
            <label>
              Amount:
              <input
                className="input"
                type="text input"
                value={this.state.withdrawAmount}
                onChange={this.handleChangeWithdraw}
              />
            </label>
            <input className="btn" type="submit" value="Withdraw"></input>
          </form>
          <h3>Stake</h3>
          <form onSubmit={this.handleStake}>
            <label>
              Amount:
              <input
                className="input"
                type="text input"
                value={this.state.stakeAmount}
                onChange={this.handleChangeStake}
              />
            </label>
            <input className="btn" type="submit" value="Deposit"></input>
          </form>
        </div>
      </div>
    );
  }
}

export default Boardroom;
