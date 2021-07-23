// GENERIC
import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";

// UTILS
import { ONE_BI, ZERO_BI } from "../utils/constants";

export function convertToBigDecimal(value: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");

  for (let i = ZERO_BI; i.lt(value as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }

  return bd;
}

export function convertToDecimal(
  value: BigInt,
  exchangeDecimals: BigInt
): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return value.toBigDecimal();
  }

  return value.toBigDecimal().div(convertToBigDecimal(exchangeDecimals));
}
