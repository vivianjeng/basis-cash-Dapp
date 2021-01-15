import React from "react";
import { ethers, Contract, BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import contractProvider from "./contract";
import { useWallet, UseWalletProvider } from "use-wallet";
import { decimalToBalance } from "./ethers-utils";
import {
  infuraKey,
  chainId,
  DAI,
  cashAddress,
  bondAddress,
  shareAddress,
  deployments,
  externalTokens,
  gasLimitMultiplier
} from "../../config";
import { Token, Fetcher, Route } from "@uniswap/sdk";

export class BasisCash {
  constructor(props) {
    this.state = { cash: "", bond: "", share: "" };
    this.contracts = {};
    this.BAC = new contractProvider(cashAddress);
    this.BAS = new contractProvider(shareAddress);
    this.BAB = new contractProvider(bondAddress);
    this.provider = this.BAC.getProvider();
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(
        deployment.address,
        deployment.abi,
        this.provider
      );
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new contractProvider(address);
    }
  }

  unlockWallet(ethereum, account) {
    const newProvider = new ethers.providers.Web3Provider(ethereum, chainId);
    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [
      this.BAC,
      this.BAS,
      this.BAB,
      ...Object.values(this.externalTokens)
    ];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.fetchBoardroomVersionOfUser()
      .then((version) => (this.boardroomVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch boardroom version: ${err.stack}`);
        this.boardroomVersionOfUser = "latest";
      });
  }

  gasOptions(gas) {
    const multiplied = Math.floor(gas.toNumber() * gasLimitMultiplier);
    console.log(`⛽️ Gas multiplied: ${gas} -> ${multiplied}`);
    return {
      gasLimit: BigNumber.from(multiplied)
    };
  }

  /**
   * @returns Basis Cash (BAC) stats from Uniswap.
   * It may differ from the BAC price used on Treasury (which is calculated in TWAP)
   */
  async getCashStatFromUniswap() {
    return {
      priceInDAI: await this.getTokenPriceFromUniswap(this.BAC),
      totalSupply: await this.BAC.displayTotalSupply()
    };
  }

  async getShareStat() {
    return {
      priceInDAI: await this.getTokenPriceFromUniswap(this.BAS),
      totalSupply: await this.BAS.displayTotalSupply()
    };
  }

  async getTokenPriceFromUniswap(tokenContract) {
    await this.provider.ready;
    const dai = new Token(chainId, DAI[0], 18);
    const token = new Token(chainId, tokenContract.contract.address, 18);

    try {
      const daiToToken = await Fetcher.fetchPairData(dai, token, this.provider);
      const priceInDai = new Route([daiToToken], token);
      return priceInDai.midPrice.toSignificant(3);
    } catch (err) {
      console.error(
        `Failed to fetch token price of ${tokenContract.symbol}: ${err}`
      );
    }
  }

  getBalance(balance, decimals = 18) {
    return balance.div(BigNumber.from(10).pow(decimals)).toNumber();
  }

  getDisplayBalance(balance, decimals = 18, fractionDigits = 3) {
    const number = this.getBalance(balance, decimals - fractionDigits);
    return (number / 10 ** fractionDigits).toFixed(fractionDigits);
  }

  async getBondOraclePriceInLastTWAP() {
    const { Treasury } = this.contracts;
    return Treasury.getBondOraclePrice();
  }

  async getBondStat() {
    // const decimals = BigNumber.from(10).pow(18);

    // const cashPrice = await this.getBondOraclePriceInLastTWAP();
    // const bondPrice = cashPrice.pow(2).div(decimals);
    const cashPrice = await this.getTokenPriceFromUniswap(this.BAC);

    return {
      priceInDAI: (cashPrice ** 2).toFixed(3),
      totalSupply: await this.BAB.displayTotalSupply()
    };
  }

  /**
   * Buy bonds with cash
   * @param amount amout of cash to purchase bonds with.
   * **/
  async buyBonds(amount) {
    const { Treasury } = this.contracts;
    return await Treasury.buyBonds(
      decimalToBalance(amount),
      await this.getBondOraclePriceInLastTWAP()
    );
  }

  /**
   * Redeem bonds for cash
   * @param amount amout of bonds to redeem.
   * **/
  async redeemBonds(amount) {
    const { Treasury } = this.contracts;
    return await Treasury.redeemBonds(
      decimalToBalance(amount),
      await this.getBondOraclePriceInLastTWAP()
    );
  }

  async earnedFromBank(poolName, account = this.myAccount) {
    const pool = this.contracts[poolName];
    try {
      return await pool.earned(account);
    } catch (err) {
      console.error(
        `Failed to call earned() on pool ${pool.address}: ${err.stake}`
      );
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(poolName, account) {
    const pool = this.contracts[poolName];
    try {
      return await pool.balanceOf(account);
    } catch (err) {
      console.error(
        `Failed to call balanceOf() on pool ${pool.address}: ${err.stack}`
      );
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName, amount) {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.stake(amount);
    return await pool.stake(amount, this.gasOptions(gas));
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName, amount) {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.withdraw(amount);
    return await pool.withdraw(amount, this.gasOptions(gas));
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName) {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.getReward();
    return await pool.getReward(this.gasOptions(gas));
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async exit(poolName) {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.exit();
    return await pool.exit(this.gasOptions(gas));
  }

  async fetchBoardroomVersionOfUser() {
    const { Boardroom1, Boardroom2 } = this.contracts;
    const balance1 = await Boardroom1.getShareOf(this.myAccount);
    if (balance1.gt(0)) {
      console.log(
        `👀 The user is using Boardroom v1. (Staked ${this.getDisplayBalance(
          balance1
        )} BAS)`
      );
      return "v1";
    }
    const balance2 = await Boardroom2.balanceOf(this.myAccount);
    if (balance2.gt(0)) {
      console.log(
        `👀 The user is using Boardroom v2. (Staked ${this.getDisplayBalance(
          balance2
        )} BAS)`
      );
      return "v2";
    }
    return "latest";
  }

  boardroomVersion(version) {
    if (version === "v1") {
      return this.contracts.Boardroom1;
    }
    if (version === "v2") {
      return this.contracts.Boardroom2;
    }
    return this.contracts.Boardroom3;
  }

  currentBoardroom() {
    if (!this.boardroomVersionOfUser) {
      throw new Error("you must unlock the wallet to continue.");
    }
    return this.boardroomByVersion(this.boardroomVersionOfUser);
  }

  isOldBoardroomMember() {
    return this.boardroomVersionOfUser !== "latest";
  }

  async stakeShareToBoardroom(amount) {
    if (this.isOldBoardroomMember()) {
      throw new Error(
        "you're using old Boardroom. please withdraw and deposit the BAS again."
      );
    }
    const Boardroom = this.currentBoardroom();
    return await Boardroom.stake(decimalToBalance(amount));
  }

  async getStakedSharesOnBoardroom() {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === "v1") {
      return await Boardroom.getShareOf(this.myAccount);
    }
    return await Boardroom.balanceOf(this.myAccount);
  }

  async getEarningsOnBoardroom() {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === "v1") {
      return await Boardroom.getCashEarningsOf(this.myAccount);
    }
    return await Boardroom.earned(this.myAccount);
  }

  async withdrawShareFromBoardroom(amount) {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.withdraw(decimalToBalance(amount));
  }

  async harvestCashFromBoardroom() {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === "v1") {
      return await Boardroom.claimDividends();
    }
    return await Boardroom.claimReward();
  }

  async exitFromBoardroom() {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.exit();
  }

  async getTreasuryNextAllocationTime() {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp = await Treasury.nextEpochPoint();
    const period = await Treasury.getPeriod();

    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(
      nextAllocation.getTime() - period.toNumber() * 1000
    );
    return { prevAllocation, nextAllocation };
  }
}

export default BasisCash;
