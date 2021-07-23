// GENERIC
import { BigDecimal } from "@graphprotocol/graph-ts";

// UTILS
import { ZERO_BD } from "../utils/constants";

export function ensureDivide(
  amount0: BigDecimal,
  amount1: BigDecimal
): BigDecimal {
  if (amount1.equals(ZERO_BD)) {
    return ZERO_BD;
  } else {
    return amount0.div(amount1);
  }
}
