import { ReadPolicies, type ReadPolicy } from "../types/ReadPolicy";

export default class Statistics {

    accesses = 0;
    hits = 0;
    misses = 0;

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
        if (this.accesses === 0)
            return 0;

        return this.hits / this.accesses;
    }

    get missRate() {
        if (this.accesses === 0)
            return 0;

        return this.misses / this.accesses;
    }

    get missPenalty(): number {
        if (this.readPolicy === ReadPolicies.NonLoadThrough) {
            // Non-Load-Through: entire block must be loaded into cache first before CPU access
            return (this.blockSize * this.MEMORY_ACCESS_TIME) + this.CACHE_HIT_TIME;
        } else {
            // Load-Through: requested word is sent directly to CPU while loading into cache
            return this.MEMORY_ACCESS_TIME;
        }
    }

    get averageMemoryAccessTime(): number {
        return (
            this.hitRate * this.CACHE_HIT_TIME +
            this.missRate * (this.CACHE_HIT_TIME + this.missPenalty)
        );
    }

    get totalMemoryAccessTime(): number {
        return this.averageMemoryAccessTime * this.accesses;
    }

}