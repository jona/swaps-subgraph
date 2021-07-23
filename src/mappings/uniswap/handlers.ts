// GENERIC
import { BigInt, Address, log } from "@graphprotocol/graph-ts";

// UTILS
import {
  UNISWAP_FACTORY_ADDRESS,
  ZERO_BI,
  ZERO_BD,
} from "../../../utils/constants";
import { sqrtPriceX96ToTokenPrices } from "../../../utils/pricing";
import { convertToDecimal } from "../../../utils/convert";

// GENERATED
import { Swap, Token, Pool } from "../../../generated/schema";
import { Swap as SwapEvent } from "../../../generated/templates/Pool/Pool";
import { Initialize } from "../../../generated/UniswapFactory/Pool";
import { PoolCreated } from "../../../generated/Templates/Pool/Factory";
import { Pool as PoolTemplate } from "../../../generated/templates";

// ENTITIES
import { createOrUpdateToken } from "../../entities/token";
import { createOrUpdateTransaction } from "../../entities/transaction";
import { createOrUpdateFactory } from "../../entities/factory";

export function handlePoolCreated(event: PoolCreated): void {
  createOrUpdateFactory(UNISWAP_FACTORY_ADDRESS);

  if (
    event.params.pool ==
    Address.fromHexString("0x8fe8d9bb8eeba3ed688069c3d6b556c9ca258248")
  ) {
    log.warning(
      "pool matched 0x8fe8d9bb8eeba3ed688069c3d6b556c9ca258248 and skipped all saves",
      []
    );

    return;
  }

  let pool = new Pool(event.params.pool.toHexString()) as Pool;
  let token0 = createOrUpdateToken(event.params.token0);
  let token1 = createOrUpdateToken(event.params.token1);

  pool.token0 = token0.id;
  pool.token1 = token1.id;
  pool.feeTier = BigInt.fromI32(event.params.fee);
  pool.createdAtTimestamp = event.block.timestamp;
  pool.createdAtBlockNumber = event.block.number;
  pool.sqrtPrice = ZERO_BI;
  pool.token0Price = ZERO_BD;
  pool.token1Price = ZERO_BD;

  pool.save();
  token0.save();
  token1.save();

  // create the tracked contract based on the template
  PoolTemplate.create(event.params.pool);
}

export function handleInitialize(event: Initialize): void {
  let pool = Pool.load(event.address.toHexString());

  pool.sqrtPrice = event.params.sqrtPriceX96;
  pool.tick = BigInt.fromI32(event.params.tick);
}

export function handleSwap(event: SwapEvent): void {
  let pool = Pool.load(event.address.toHexString());

  // hot fix for bad pricing
  if (pool.id == "0x9663f2ca0454accad3e094448ea6f77443880454") {
    log.warning(
      "pool matched 0x9663f2ca0454accad3e094448ea6f77443880454 and skipped all saves",
      []
    );

    return;
  }

  let token0 = Token.load(pool.token0);
  let token1 = Token.load(pool.token1);

  // amounts - 0/1 are token deltas: can be positive or negative
  let amount0 = convertToDecimal(event.params.amount0, token0.decimals);
  let amount1 = convertToDecimal(event.params.amount1, token1.decimals);

  let prices = sqrtPriceX96ToTokenPrices(
    pool.sqrtPrice,
    token0 as Token,
    token1 as Token
  );
  pool.token0Price = prices[0];
  pool.token1Price = prices[1];
  pool.tick = BigInt.fromI32(event.params.tick as i32);

  let transaction = createOrUpdateTransaction(event);
  let swap = new Swap(
    transaction.id + "#" + pool.createdAtTimestamp.toString()
  );
  swap.transaction = transaction.id;
  swap.type = "uniswap";
  swap.timestamp = transaction.timestamp;
  swap.pool = pool.id;
  swap.token0 = pool.token0;
  swap.token1 = pool.token1;
  swap.sender = event.params.sender;
  swap.origin = event.transaction.from;
  swap.recipient = event.params.recipient;
  swap.amount0 = amount0;
  swap.amount1 = amount1;
  swap.tick = BigInt.fromI32(event.params.tick as i32);
  swap.logIndex = event.logIndex;

  swap.save();
  pool.save();
  token0.save();
  token1.save();
}
