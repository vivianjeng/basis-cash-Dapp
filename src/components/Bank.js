import React, { Component, useEffect } from "react";
import approveToken from "./approve";
import BasisCash from "./BasisCash";
import { ethers, BigNumber } from "ethers";

class Bank extends Component {
  constructor(props) {
    super(props);
    this.state = { withdrawAmount: "", stakeAmount: "" };
    this.basis = new BasisCash();
    this.basis.unlockWallet(
      this.props.wallet.ethereum,
      this.props.wallet.account
    );
    if (this.props.token === "BAC_DAI-UNI-LPv2") {
      this.poolName = "DAIBACLPTokenSharePool";
    } else {
      this.poolName = "DAIBASLPTokenSharePool";
    }

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
    this.basis.unstake(
      this.poolName,
      BigNumber.from(this.state.withdrawAmount)
    );
    event.preventDefault();
  }

  handleStake(event) {
    this.basis.stake(this.poolName, BigNumber.from(this.state.stakeAmount));
    event.preventDefault();
  }

  harvest() {
    this.basis.harvest(this.poolName);
  }

  exit() {
    this.basis.exit(this.poolName);
  }

  render() {
    return (
      <div>
        <div className="card2">
          <h2>Earn BAS by {this.props.token}</h2>
          <h3>Approve</h3>
          <button
            className="btn"
            onClick={() => approveToken(this.props.wallet, this.props.token)}
          >
            Approve {this.props.token}
          </button>
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
            <input className="btn" type="submit" value="Stake"></input>
          </form>
          <h3>Harvet</h3>
          <button className="btn" onClick={() => this.harvest()}>
            Harvest {this.poolName}
          </button>
          <h3>Exit</h3>
          <button className="btn" onClick={() => this.exit()}>
            Exit {this.poolName}
          </button>
        </div>
      </div>
    );
  }
}

export default Bank;
