import Cache from "./Cache";
import LRU from "./policies/LRU";
import SequenceGenerator from "./SequenceGenerator";
import { SequenceType } from "../types/SequenceType";
import { ReadPolicy } from "../types/ReadPolicy";

const cache = new Cache({

    blockSize: 4,

    cacheBlocks: 16,

    readPolicy: ReadPolicy.LoadThrough,

    replacementPolicy: new LRU()

});

const sequence = SequenceGenerator.generate(
    SequenceType.Sequential,
    16
);

const trace = cache.runSequence(sequence);

console.log(trace);

console.log(cache.statistics);