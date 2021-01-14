import React, { Component, useEffect } from "react";
import approveToken from "./approve";
import BasisCash from "./BasisCash";

function Boardroom(wallet) {
  return (
    <div>
      <div className="card">
        <h2>Boardroom</h2>
        <button className="btn" onClick={() => approveToken(wallet, "BAS")}>
          Approve Basis Share
        </button>
        <button className="btn" disabled="disabled">
          Claim Reward <br /> (basisCash.harvestCashFromBoardroom)
        </button>
        <button className="btn" disabled="disabled">
          Settle & Withdraw <br /> (basisCash.exitFromBoardroom)
        </button>
        <p>isOldBoardroomMember</p>
        <button className="btn" disabled="disabled">
          Settle & Withdraw <br /> (basisCash.exitFromBoardroom)
        </button>
        <p>notOldBoardroomMember</p>
        <button className="btn" disabled="disabled">
          Withdraw <br /> (basisCash.withdrawShareFromBoardroom)
        </button>
        <button className="btn" disabled="disabled">
          Deposit <br /> (basisCash.stakeShareToBoardroom)
        </button>
      </div>
    </div>
  );
}

export default Boardroom;
