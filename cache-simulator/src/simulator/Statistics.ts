export default class Statistics {

    accesses = 0;

    hits = 0;

    misses = 0;

    readonly CACHE_HIT_TIME = 1;
    readonly MEMORY_ACCESS_TIME = 10;   //*Based on previous examples

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

    get averageMemoryAccessTime(): number {
        return (
            this.hitRate * this.CACHE_HIT_TIME +
            this.missRate *
                (this.CACHE_HIT_TIME + this.MEMORY_ACCESS_TIME)
        );
    }

    get totalMemoryAccessTime(): number {
        return this.averageMemoryAccessTime * this.accesses;
    }

}