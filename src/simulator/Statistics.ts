import { ReadPolicies, type ReadPolicy } from "../types/ReadPolicy";

export default class Statistics {

    accesses = 0;
    hits = 0;
    misses = 0;

    // Based on previous examples
    readonly CACHE_HIT_TIME = 1;
    readonly MEMORY_ACCESS_TIME = 10;

    blockSize: number;
    readPolicy: ReadPolicy;

    constructor(blockSize = 4, readPolicy: ReadPolicy = ReadPolicies.LoadThrough) {
        this.blockSize = blockSize;
        this.readPolicy = readPolicy;
    }

    recordHit() {
        this.accesses++;
        this.hits++;
    }

    recordMiss() {
        this.accesses++;
        this.misses++;
    }

    get hitRate() {
        // Avoid division by 0 before any accesses occur
        if (this.accesses === 0)
            return 0;

        return this.hits / this.accesses;
    }

    get missRate() {
        // Avoid division by 0 before any accesses occur
        if (this.accesses === 0)
            return 0;

        return this.misses / this.accesses;
    }

    // Calculates the miss penalty based on selected read policy
    get missPenalty(): number {
        if (this.readPolicy === ReadPolicies.NonLoadThrough) {
            // Non-Load-Through: entire block must be loaded into cache first before CPU access
            // +1 cycle accounts for time for cache lookup
            return (this.blockSize * this.MEMORY_ACCESS_TIME) + this.CACHE_HIT_TIME + 1;
        } else {
            // Load-Through: requested word is sent directly to CPU while loading into cache
            // +1 cycle accounts for time for cache lookup
            return this.MEMORY_ACCESS_TIME + 1;
        }
    }

    get averageMemoryAccessTime(): number {
        return (
            (this.hitRate * this.CACHE_HIT_TIME) +
            (this.missRate * this.missPenalty)
            // Average time = (hC) + (1-h) * M
        );
    }

    get totalMemoryAccessTime(): number {
        return this.averageMemoryAccessTime * this.accesses;
    }

}