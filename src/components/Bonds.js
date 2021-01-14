import React, { Component, useEffect } from "react";
import approveToken from "./approve";
import BasisCash from "./BasisCash";

function Bonds(wallet) {
  return (
    <div>
      <div className="card">
        <h2>Basis Cash</h2>
        <button className="btn" onClick={() => approveToken(wallet, "BAC")}>
          Approve Basis Cash
        </button>
        <button className="btn" disabled="disabled">
          Purchase from BAC to BAB <br /> (basisCash.buyBonds)
        </button>
        <button className="btn" disabled="disabled">
          Redeem from BAB to BAC <br /> (basisCash.redeemBonds)
        </button>
      </div>
    </div>
  );
}

export default Bonds;
