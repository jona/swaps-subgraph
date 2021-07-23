// GENERIC
import { BigInt, Address, log } from "@graphprotocol/graph-ts";

// GENERATED
import { ERC20 } from "../generated/UniswapFactory/ERC20";
import { ERC20SymbolBytes } from "../generated/UniswapFactory/ERC20SymbolBytes";
import { ERC20NameBytes } from "../generated/UniswapFactory/ERC20NameBytes";

import { StaticTokenDefinition } from "./staticTokenDefinition";
import { isNullEthValue } from "./null";

export function fetchTokenSymbol(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress);
  let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress);

  // try types string and bytes32 for symbol
  let symbolValue = "unknown";
  let symbolResult = contract.try_symbol();
  if (symbolResult.reverted) {
    log.warning("symbol call on ERC20 reverted for {}", [tokenAddress.toHex()]);

    let symbolResultBytes = contractSymbolBytes.try_symbol();
    if (!symbolResultBytes.reverted) {
      log.warning("symbol call on ERC20SymbolBytes reverted for {}", [
        tokenAddress.toHex(),
      ]);

      // for broken pairs that have no symbol function exposed
      if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
        symbolValue = symbolResultBytes.value.toString();
      } else {
        // try with the static definition
        let staticTokenDefinition = StaticTokenDefinition.fromAddress(
          tokenAddress
        );
        if (staticTokenDefinition != null) {
          symbolValue = staticTokenDefinition.symbol;
        }
      }
    }
  } else {
    symbolValue = symbolResult.value;
  }

  return symbolValue;
}

export function fetchTokenName(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress);
  let contractNameBytes = ERC20NameBytes.bind(tokenAddress);

  // try types string and bytes32 for name
  let nameValue = "unknown";
  let nameResult = contract.try_name();
  if (nameResult.reverted) {
    log.warning("name call on ERC20 reverted for {}", [tokenAddress.toHex()]);

    let nameResultBytes = contractNameBytes.try_name();
    if (!nameResultBytes.reverted) {
      log.warning("name call on ERC20NameBytes reverted for {}", [
        tokenAddress.toHex(),
      ]);

      // for broken exchanges that have no name function exposed
      if (!isNullEthValue(nameResultBytes.value.toHexString())) {
        nameValue = nameResultBytes.value.toString();
      } else {
        // try with the static definition
        let staticTokenDefinition = StaticTokenDefinition.fromAddress(
          tokenAddress
        );
        if (staticTokenDefinition != null) {
          nameValue = staticTokenDefinition.name;
        }
      }
    }
  } else {
    nameValue = nameResult.value;
  }

  return nameValue;
}

export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress);
  let totalSupplyValue = null;
  let totalSupplyResult = contract.try_totalSupply();
  if (!totalSupplyResult.reverted) {
    totalSupplyValue = totalSupplyResult as i32;
    log.warning("totalSupply call reverted for {}", [tokenAddress.toHex()]);
  }
  return BigInt.fromI32(totalSupplyValue as i32);
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress);
  // try types uint8 for decimals
  let decimalValue = null;
  let decimalResult = contract.try_decimals();
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value;
    log.warning("decimals call reverted for {}", [tokenAddress.toHex()]);
  } else {
    // try with the static definition
    let staticTokenDefinition = StaticTokenDefinition.fromAddress(tokenAddress);
    if (staticTokenDefinition != null) {
      return staticTokenDefinition.decimals;
    }
  }

  return BigInt.fromI32(decimalValue as i32);
}
