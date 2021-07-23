// GENERIC
import { Address } from "@graphprotocol/graph-ts";

// UTILS
import {
  fetchTokenSymbol,
  fetchTokenName,
  fetchTokenTotalSupply,
  fetchTokenDecimals,
} from "../../utils/token";

// GENERATED
import { Token } from "../../generated/schema";

export function createOrUpdateToken(tokenAddress: Address): Token {
  let token = Token.load(tokenAddress.toHexString());

  if (token === null) {
    token = new Token(tokenAddress.toHexString());
    token.symbol = fetchTokenSymbol(tokenAddress);
    token.name = fetchTokenName(tokenAddress);
    token.totalSupply = fetchTokenTotalSupply(tokenAddress);

    let decimals = fetchTokenDecimals(tokenAddress);

    token.decimals = decimals;
    token.save();
  }

  return token as Token;
}
