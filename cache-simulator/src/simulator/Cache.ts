import CacheSet from "./CacheSet";
import Statistics from "./Statistics";
import type ReplacementPolicy from "./ReplacementPolicy";

export default class Cache {

    readonly MAIN_MEMORY_BLOCKS = 1024;

    blockSize: number;
    numberOfBlocks: number;
    numberOfSets: number;

    sets: CacheSet[];
    policy: ReplacementPolicy;
    statistics: Statistics;

    constructor(
        blockSize: number,
        numberOfBlocks: number,
        policy: ReplacementPolicy
    ) {

        this.blockSize = blockSize;
        this.numberOfBlocks = numberOfBlocks;
        this.numberOfSets = numberOfBlocks / 4;

        this.policy = policy;
        this.statistics = new Statistics();

        this.sets = [];

        for (let i = 0; i < this.numberOfSets; i++) {
            this.sets.push(new CacheSet());
        }
    }

    private getSetIndex(memoryBlock: number): number {
        return memoryBlock % this.numberOfSets;
    }

    private getTag(memoryBlock: number): number {
        return Math.floor(memoryBlock / this.numberOfSets);
    }

    private findBlock(set: CacheSet, tag: number): number {

    for (let i = 0; i < set.blocks.length; i++) {

        const block = set.blocks[i];

        if (block.valid && block.tag === tag) {
            return i;
        }

    }

    return -1;

    
    }

    access(memoryBlock: number): boolean {

        const setIndex = this.getSetIndex(memoryBlock);

        const tag = this.getTag(memoryBlock);

        const set = this.sets[setIndex];

        const blockIndex = this.findBlock(set, tag);

        if (blockIndex !== -1) {

            this.statistics.recordHit();

            this.policy.recordAccess(set, blockIndex);

            return true;

        }

        this.statistics.recordMiss();

        const victim = this.policy.selectVictim(set);

        const block = set.blocks[victim];

        block.valid = true;
        block.tag = tag;
        block.memoryBlock = memoryBlock;

        this.policy.recordAccess(set, victim);

        return false;

    }

    reset() {

        this.statistics = new Statistics();

        for (const set of this.sets) {

            for (const block of set.blocks) {

                block.clear();

            }

        }

    }

}