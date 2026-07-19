import Cache from "./Cache";
import LRU from "./policies/LRU";

const cache = new Cache(4, 16, new LRU());

const sequence = [0, 1, 2, 3, 0, 1, 2, 3];

for (const block of sequence) {

    const hit = cache.access(block);

    console.log(
        block,
        hit ? "HIT" : "MISS"
    );

}

console.log(cache.statistics);