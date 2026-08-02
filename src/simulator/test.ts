import Cache from "./Cache";
import LRU from "./policies/LRU";
import SequenceGenerator from "./SequenceGenerator";
import { SequenceTypes } from "../types/SequenceType";
import { ReadPolicies } from "../types/ReadPolicy";

const cache = new Cache({
    blockSize: 4,
    cacheBlocks: 16,
    readPolicy: ReadPolicies.LoadThrough,
    replacementPolicy: new LRU()
});

const sequence = SequenceGenerator.generate(
    SequenceTypes.Sequential,
    16
);

const trace = cache.runSequence(sequence);

console.log(trace);
console.log(cache.statistics);