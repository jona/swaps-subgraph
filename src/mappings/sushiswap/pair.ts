// GENERIC
import { Address, ethereum } from "@graphprotocol/graph-ts";

// UTILS
import { ZERO_BD } from "../../../utils/constants";

// GENERATED
import { Pair as PairContract } from "../../../generated/templates/Pair/Pair";
import { Pair } from "../../../generated/schema";

// ENTITIES
import { createOrUpdateToken } from "../../entities/token";

export function createOrUpdatePair(
  address: Address,
  block: ethereum.Block = null
): Pair | null {
  let pair = Pair.load(address.toHex());

  if (pair === null) {
    const pairContract = PairContract.bind(address);

    const token0 = createOrUpdateToken(pairContract.token0());

    if (token0 === null) {
      return null;
    }

    const token1 = createOrUpdateToken(pairContract.token1());

    if (token1 === null) {
      return null;
    }

    pair = new Pair(address.toHex());
    pair.name = token0.symbol.concat("-").concat(token1.symbol);
    pair.token0 = token0.id;
    pair.token1 = token1.id;
    pair.reserve0 = ZERO_BD;
    pair.reserve1 = ZERO_BD;
    pair.totalSupply = ZERO_BD;
    pair.token0Price = ZERO_BD;
    pair.token1Price = ZERO_BD;
    pair.timestamp = block.timestamp;
    pair.block = block.number;

    pair.save();
  }

  return pair;
}
