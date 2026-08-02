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

        // Store cache configuration
        this.blockSize = config.blockSize;
        this.numberOfBlocks = config.cacheBlocks;

        // 4-way set associative cache: No. of sets = total cache blocks / 4
        this.numberOfSets = config.cacheBlocks / 4;

        this.readPolicy = config.readPolicy;
        this.policy = config.replacementPolicy;
        this.statistics = new Statistics(config.blockSize, config.readPolicy);
        
        // Create all cache sets
        this.sets = [];

        for (let i = 0; i < this.numberOfSets; i++) {
            this.sets.push(new CacheSet());
        }

    }

    // Compute which set a memory block belongs to
    private getSetIndex(memoryBlock: number): number {
        return memoryBlock % this.numberOfSets;
    }

    // Computes tag for a memory block
    private getTag(memoryBlock: number): number {
        return Math.floor(memoryBlock / this.numberOfSets);
    }

    // Searches every way within a set for the requested tag
    // Returns matching way if found, otherwise returns -1 (cache miss)
    private findBlock(set: CacheSet, tag: number): number {
        for (let i = 0; i < set.blocks.length; i++) {
            const block = set.blocks[i];
            if (block.valid && block.tag === tag) {
                return i;
            }

        }
        
        return -1;
    }

    // Simulate one memory access
    access(memoryBlock: number): AccessResult {

        // Determine where this memory block should be located
        const setIndex = this.getSetIndex(memoryBlock);
        const tag = this.getTag(memoryBlock);
        const set = this.sets[setIndex];

        // Check if the block already exists in the cache
        const blockIndex = this.findBlock(set, tag);

        // Cache hit
        if (blockIndex !== -1) {
            //Update statistics
            this.statistics.recordHit();

            // Notify replacement policy to update LRU/MRU ordering
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

        // Cache miss
        // Update miss statistics
        this.statistics.recordMiss();

        // Ask replacement policy which cache way should receive the new block
        const victim = this.policy.selectVictim(set);
        const block = set.blocks[victim];

        // True if an existing valid block is being evicted
        const replaced = block.valid;

        // Load requested block into cache
        block.valid = true;
        block.tag = tag;
        block.memoryBlock = memoryBlock;

        // Inform replacement policy that this way was just accessed
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

    // Clears cache contents and statistics before starting new simulation
    reset() {
        this.statistics = new Statistics(this.blockSize, this.readPolicy);

        for (const set of this.sets) {
            for (const block of set.blocks) {
                block.clear();
            }
        }
    }

    // Executes an entire sequence of memory accesses
    runSequence(sequence: number[]): SimulationResult {
        // Start with empty cache
        this.reset();
        const steps: SimulationStep[] = [];

        // Simulate every memory access
        for (let i = 0; i < sequence.length; i++) {
            const block = sequence[i];

            // Process one access
            const result = this.access(block);
            // Record the access trace
            const trace: AccessTrace = {
                accessNumber: i + 1,
                result
            };

            // Save both the trace and the cache snapshot
            steps.push({
                trace,
                cacheState: this.cloneCacheState()
            });
        }

        // Return full simulation history and statistics
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

    // Creates "deep copy" of cache:
    // Allows simulation steps to preserve its own cache snapshot
    // without being modified by future accesses
    private cloneCacheState(): CacheSet[] {

        return this.sets.map((set) => {
            const clonedSet = new CacheSet();
            clonedSet.blocks = set.blocks.map(block => block.clone());
            return clonedSet;
        });

    }

}