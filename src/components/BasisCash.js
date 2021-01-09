import React from "react";
import { ethers, Contract, BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import contractProvider from "./contract";
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
    this.BAC = new contractProvider(cashAddress);
    this.BAS = new contractProvider(shareAddress);
    this.BAB = new contractProvider(bondAddress);
    this.provider = this.BAC.getProvider();
  }

  async getCashStatFromUniswap() {
    const supply = await this.BAC.displayTotalSupply();
    return {
      priceInDAI: await this.getTokenPriceFromUniswap(this.BAC),
      totalSupply: supply
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
    balance.div(BigNumber.from(10).pow(decimals)).toNumber();
  }

  getDisplayBalace(balance, decimals = 18, fractionDigits = 3) {
    const number = this.getBalance(balance, decimals - fractionDigits);
    return (number / 10 ** fractionDigits).toFixed(fractionDigits);
  }
}

export default BasisCash;
