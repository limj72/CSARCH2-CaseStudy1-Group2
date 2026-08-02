import CacheSet from "../CacheSet";
import type ReplacementPolicy from "../ReplacementPolicy";

// Most recently used block is replaced when cache is full
export default class MRU implements ReplacementPolicy {

    // Global access counter used as a timestamp
    // Larger values = more recent accesses
    private counter = 0;

    // Called whenever a cache block is accessed
    // (either a hit or after loading a missed block)
    recordAccess(set: CacheSet, blockIndex: number): void {
        this.counter++;
        set.blocks[blockIndex].lastAccess = this.counter;
    }

    // Choose cache block to be replaced
    selectVictim(set: CacheSet): number {

        // Invalid blocks are used before replacing existing ones
        for (let i = 0; i < set.blocks.length; i++) {
            if (!set.blocks[i].valid)
                return i;
        }

        // Assume first block is the LRU block
        let victim = 0;

        // Store newest access timestamp found so far
        let newest = set.blocks[0].lastAccess;

        for (let i = 1; i < set.blocks.length; i++) {
            // Larger timestamp = accessed more recently
            if (set.blocks[i].lastAccess > newest) {
                newest = set.blocks[i].lastAccess;
                victim = i;
            }

        }

        return victim;
    }

}