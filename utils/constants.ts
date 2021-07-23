// GENERIC
import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const UNISWAP_FACTORY_ADDRESS =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";
export const SUSHISWAP_FACTORY_ADDRESS =
  "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);
