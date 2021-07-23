// GENERATED
import { Factory } from "../../generated/schema";

export function createOrUpdateFactory(address: string): Factory {
  let factory = Factory.load(address);

  if (factory === null) {
    factory = new Factory(address);
    factory.save();
  }

  return factory as Factory;
}
