import CacheSet from "../CacheSet";
import type ReplacementPolicy from "../ReplacementPolicy";

export default class MRU implements ReplacementPolicy {

    private counter = 0;

    recordAccess(set: CacheSet, blockIndex: number): void {
        this.counter++;
        set.blocks[blockIndex].lastAccess = this.counter;
    }

    selectVictim(set: CacheSet): number {

        for (let i = 0; i < set.blocks.length; i++) {
            if (!set.blocks[i].valid)
                return i;
        }

        let victim = 0;

        let newest = set.blocks[0].lastAccess;

        for (let i = 1; i < set.blocks.length; i++) {

            if (set.blocks[i].lastAccess > newest) {
                newest = set.blocks[i].lastAccess;
                victim = i;
            }

        }

        return victim;
    }

}