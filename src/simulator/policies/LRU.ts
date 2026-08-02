import CacheSet from "../CacheSet";
import type ReplacementPolicy from "../ReplacementPolicy";

// Least recently used block is replaced when cache is full
export default class LRU implements ReplacementPolicy {

    // Global access counter used as a timestamp
    // Larger values = more recent accesses
    private counter = 0;

    // Called whenever a cache block is accessed
    // (either a hit or after loading a missed block)
    recordAccess(set: CacheSet, blockIndex: number): void {
        this.counter++; // Advance global timestamp
        set.blocks[blockIndex].lastAccess = this.counter; // Record this block's most recent access block
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

        // Store oldest access timestamp found so far
        let oldest = set.blocks[0].lastAccess;

        for (let i = 1; i < set.blocks.length; i++) {
            // Smaller timestamp = accessed longer ago
            if (set.blocks[i].lastAccess < oldest) {
                oldest = set.blocks[i].lastAccess;
                victim = i;
            }

        }

        return victim;
    }

}