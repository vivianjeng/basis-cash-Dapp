import { TransactionResponse } from "@ethersproject/providers";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWallet } from "use-wallet";

export function useTransactionAdder() {
  const { chainId, account } = useWallet();
  const dispatch = useDispatch();

  return useCallback(
    (response, {summary, approval}: {summary?: String; approval?:})
  );
}
