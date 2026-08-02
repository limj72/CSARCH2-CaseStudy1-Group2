import CacheSet from "./CacheSet";

// Defines behavior of a cache replacement policy
export default interface ReplacementPolicy {
    // Selects which cache block should be replaced
    // when a cache miss occurs and the set is full
    selectVictim(set: CacheSet): number;

    // Updates the replacement policy's tracking info
    // whenever a cache block is accessed (hit or newly loaded)
    recordAccess(set: CacheSet, blockIndex: number): void;
}