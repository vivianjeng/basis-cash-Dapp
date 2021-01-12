import { parseUnits } from "ethers/lib/utils";

export function decimalToBalance(d, decimals = 18) {
  return parseUnits(String(d), decimals);
}
