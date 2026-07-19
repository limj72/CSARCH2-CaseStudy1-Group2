export default class Statistics {

    accesses = 0;

    hits = 0;

    misses = 0;

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

}