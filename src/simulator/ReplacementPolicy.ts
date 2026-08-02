import CacheSet from "./CacheSet";

export default interface ReplacementPolicy {
    selectVictim(set: CacheSet): number;

    recordAccess(set: CacheSet, blockIndex: number): void;
}