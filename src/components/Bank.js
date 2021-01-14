import React, { Component, useEffect } from "react";
import approveToken from "./approve";
import BasisCash from "./BasisCash";

function approve(wallet, tokenName) {
  const basis = new BasisCash();
  basis.unlockWallet(wallet.ethereum, wallet.account);
  approveToken(basis, tokenName);
}

function Bank(wallet) {
  return (
    <div>
      <div className="card">
        <h2>Earn BAS by BAC-DAI-LP</h2>
        <button
          className="btn"
          onClick={() => approve(wallet, "BAC_DAI-UNI-LPv2")}
        >
          Approve BAC_DAI-UNI-LPv2
        </button>
        <button className="btn" disabled="disabled">
          Withdraw BAC_DAI-UNI-LPv2 <br /> (basisCash.unstake)
        </button>
        <button className="btn" disabled="disabled">
          Stake BAC_DAI-UNI-LPv2 <br /> (basisCash.stake)
        </button>
        <button className="btn" disabled="disabled">
          Harvest BAC_DAI-UNI-LPv2 <br /> (basisCash.harvest)
        </button>
        <button className="btn" disabled="disabled">
          Redeem BAC_DAI-UNI-LPv2 <br /> (basisCash.exit)
        </button>
        <h2>Earn BAS by BAS-DAI-LP</h2>
        <button
          className="btn"
          onClick={() => approve(wallet, "BAS_DAI-UNI-LPv2")}
        >
          Approve BAS_DAI-UNI-LPv2
        </button>
        <button className="btn" disabled="disabled">
          Withdraw BAS_DAI-UNI-LPv2 <br /> (basisCash.unstake)
        </button>
        <button className="btn" disabled="disabled">
          Stake BAS_DAI-UNI-LPv2 <br /> (basisCash.stake)
        </button>
        <button className="btn" disabled="disabled">
          Harvest BAS_DAI-UNI-LPv2 <br /> (basisCash.harvest)
        </button>
        <button className="btn" disabled="disabled">
          Redeem BAS_DAI-UNI-LPv2 <br /> (basisCash.exit)
        </button>
      </div>
    </div>
  );
}

export default Bank;
