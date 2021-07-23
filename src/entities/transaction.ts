// GENERIC
import { ethereum } from "@graphprotocol/graph-ts";

// GENERATED
import { Transaction } from "../../generated/schema";

export function createOrUpdateTransaction(event: ethereum.Event): Transaction {
  let transaction = Transaction.load(event.transaction.hash.toHexString());
  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHexString());
  }
  transaction.blockNumber = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.gasUsed = event.transaction.gasUsed;
  transaction.gasPrice = event.transaction.gasPrice;
  transaction.save();

  return transaction as Transaction;
}
