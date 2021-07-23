// GENERIC
import { Address } from "@graphprotocol/graph-ts";

// UTILS
import { convertToDecimal } from "../../../utils/convert";
import { SUSHISWAP_FACTORY_ADDRESS } from "../../../utils/constants";

import { Swap } from "../../../generated/schema";
import { Swap as SwapEvent } from "../../../generated/templates/Pair/Pair";
import { PairCreated } from "../../../generated/SushiSwapFactory/Factory";
import { Pair as PairTemplate } from "../../../generated/templates";

// ENTITIES
import { createOrUpdateTransaction } from "../../entities/transaction";
import { createOrUpdateToken } from "../../entities/token";
import { createOrUpdateFactory } from "../../entities/factory";

import { createOrUpdatePair } from "./pair";

export function onPairCreated(event: PairCreated): void {
  createOrUpdateFactory(SUSHISWAP_FACTORY_ADDRESS);

  const pair = createOrUpdatePair(event.params.pair, event.block);

  if (!pair) return;

  PairTemplate.create(event.params.pair);
}

export function handleSwap(event: SwapEvent): void {
  const pair = createOrUpdatePair(event.address, event.block);
  const token0 = createOrUpdateToken(Address.fromString(pair.token0));
  const token1 = createOrUpdateToken(Address.fromString(pair.token1));

  const amount0In = convertToDecimal(event.params.amount0In, token0.decimals);
  const amount1In = convertToDecimal(event.params.amount1In, token1.decimals);
  const amount0Out = convertToDecimal(event.params.amount0Out, token0.decimals);
  const amount1Out = convertToDecimal(event.params.amount1Out, token1.decimals);

  // totals for volume updates
  const amount0Total = amount0Out.plus(amount0In);
  const amount1Total = amount1Out.plus(amount1In);

  let transaction = createOrUpdateTransaction(event);

  const swap = new Swap(transaction.id + "#" + pair.timestamp.toString());

  swap.pair = pair.id;
  swap.transaction = transaction.id;
  swap.type = "sushiswap";
  swap.timestamp = transaction.timestamp;
  swap.transaction = transaction.id;
  swap.sender = event.params.sender;
  swap.token0 = pair.token0;
  swap.token1 = pair.token1;
  swap.amount0 = amount0Total;
  swap.amount1 = amount1Total;
  swap.recipient = event.params.to;
  swap.logIndex = event.logIndex;
  swap.origin = event.transaction.from;

  swap.save();
  pair.save();
  token0.save();
  token1.save();
}
