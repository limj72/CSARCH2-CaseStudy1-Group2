import CacheSet from "./CacheSet";
import Statistics from "./Statistics";
import type ReplacementPolicy from "./ReplacementPolicy";
import type { AccessResult } from "../types/AccessResult";
import type { AccessTrace } from "../types/AccessTrace";
import type { CacheConfig } from "../types/CacheConfig.ts";

export default class Cache {

    readonly MAIN_MEMORY_BLOCKS = 1024;

    blockSize: number;
    numberOfBlocks: number;
    numberOfSets: number;

    sets: CacheSet[];
    policy: ReplacementPolicy;
    statistics: Statistics;

    private accessCounter = 0;

    constructor(config: CacheConfig) {

        if (config.blockSize < 2 || !this.isPowerOfTwo(config.blockSize)) {
            throw new Error("Block size must be a power of two and at least 2.");
        }

        if (config.cacheBlocks < 4 || !this.isPowerOfTwo(config.cacheBlocks)) {
            throw new Error("Cache blocks must be a power of two and at least 4.");
        }

    this.blockSize = config.blockSize;

    this.numberOfBlocks = config.cacheBlocks;

    this.numberOfSets = config.cacheBlocks / 4;

    this.policy = config.replacementPolicy;

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

    access(memoryBlock: number): AccessResult {

        const setIndex = this.getSetIndex(memoryBlock);

        const tag = this.getTag(memoryBlock);

        const set = this.sets[setIndex];

        const blockIndex = this.findBlock(set, tag);

        if (blockIndex !== -1) {

            this.statistics.recordHit();

            this.policy.recordAccess(set, blockIndex);

            return {

                memoryBlock,

                setIndex,

                tag,

                hit: true,

                way: blockIndex,

                replaced: false

            };

        }

        this.statistics.recordMiss();

        const victim = this.policy.selectVictim(set);

        const block = set.blocks[victim];

        const replaced = block.valid;

        block.valid = true;
        block.tag = tag;
        block.memoryBlock = memoryBlock;

        this.policy.recordAccess(set, victim);

        return {

            memoryBlock,

            setIndex,

            tag,

            hit: false,

            way: victim,

            replaced

        };

    }

    reset() {

        this.statistics = new Statistics();
        this.accessCounter = 0;

        for (const set of this.sets) {

            for (const block of set.blocks) {

                block.clear();

            }

        }

    }

    runSequence(sequence: number[]): AccessTrace[] {

        const trace: AccessTrace[] = [];

        for (const block of sequence) {

            this.accessCounter++;

            const result = this.access(block);

            trace.push({
                accessNumber: this.accessCounter,
                result
            });

        }

        return trace;

    }

    private isPowerOfTwo(value: number): boolean {
        return value > 0 && (value & (value - 1)) === 0;
    }

    getCacheState(): CacheSet[] {
        return this.sets;
    }

}