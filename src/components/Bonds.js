import { useCallback } from "react";
import { useWallet, UseWalletProvider } from "use-wallet";
import BasisCash from "./BasisCash";

export class Bond {
  constructor(props) {
    this.basisCash = new BasisCash();
  }
  async handleBuyBonds(amount) {
    const tx = this.basisCash.buyBonds(amount);
    console.log(tx);
  }
}
