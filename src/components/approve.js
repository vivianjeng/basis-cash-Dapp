import React from "react";
import { ethers } from "ethers";
import BasisCash from "./BasisCash";

const APPROVE_AMOUNT = ethers.constants.MaxUint256;

function approveToken(wallet, token) {
  const basis = new BasisCash();
  basis.unlockWallet(wallet.ethereum, wallet.account);
  if (token == "BAC") {
    console.log(basis.BAC.contract.approve(basis.BAC.address, APPROVE_AMOUNT));
  } else if (token == "BAS") {
    console.log(basis.BAS.contract.approve(basis.BAS.address, APPROVE_AMOUNT));
  } else {
    const response = basis.externalTokens[token].contract.approve(
      basis.externalTokens[token].address,
      APPROVE_AMOUNT
    );
  }
}

export default approveToken;
