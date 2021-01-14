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
  externalTokens
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
  }

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
        "Failed to fetch token price of ${tokenContract.symbol}: ${err}"
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
}

export default BasisCash;
