import type ReplacementPolicy from "../simulator/ReplacementPolicy";
import type { ReadPolicy } from "./ReadPolicy";

export interface CacheConfig {

    blockSize: number;

    cacheBlocks: number;

    readPolicy: ReadPolicy;

    replacementPolicy: ReplacementPolicy;

}