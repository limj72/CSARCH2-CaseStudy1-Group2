import CacheSet from "./CacheSet";
import Statistics from "./Statistics";
import type ReplacementPolicy from "./ReplacementPolicy";
import type { AccessResult } from "../types/AccessResult";
import type { AccessTrace } from "../types/AccessTrace";
import type { CacheConfig } from "../types/CacheConfig";
import type { ReadPolicy } from "../types/ReadPolicy";
import type { SimulationResult } from "../types/SimulationResult";
import type { SimulationStep } from "../types/SimulationStep";

export default class Cache {

    readonly MAIN_MEMORY_BLOCKS = 1024;

    blockSize: number;
    numberOfBlocks: number;
    numberOfSets: number;
    readPolicy: ReadPolicy;

    sets: CacheSet[];
    policy: ReplacementPolicy;
    statistics: Statistics;

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
        this.readPolicy = config.readPolicy;
        this.policy = config.replacementPolicy;
        this.statistics = new Statistics(config.blockSize, config.readPolicy);
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
        this.statistics = new Statistics(this.blockSize, this.readPolicy);

        for (const set of this.sets) {
            for (const block of set.blocks) {
                block.clear();
            }
        }
    }

    runSequence(sequence: number[]): SimulationResult {
        this.reset();
        const steps: SimulationStep[] = [];

        for (let i = 0; i < sequence.length; i++) {
            const block = sequence[i];
            const result = this.access(block);
            const trace: AccessTrace = {
                accessNumber: i + 1,
                result
            };

            steps.push({
                trace,
                cacheState: this.cloneCacheState()
            });
        }

        return {
            steps,
            statistics: this.statistics
        };

    }

    private isPowerOfTwo(value: number): boolean {
        return value > 0 && (value & (value - 1)) === 0;
    }

    getCacheState(): CacheSet[] {
        return this.sets.map(set => set);
    }

    private cloneCacheState(): CacheSet[] {

        return this.sets.map((set) => {
            const clonedSet = new CacheSet();
            clonedSet.blocks = set.blocks.map(block => block.clone());
            return clonedSet;
        });

    }

}