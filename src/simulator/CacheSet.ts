import CacheBlock from "./CacheBlock";

// Represents one cache set in 4-way set associative cache
// Each set contains exactly four cache blocks (ways)
export default class CacheSet {
    // Array of cache blocks to this set
    blocks: CacheBlock[];

    constructor() {
        this.blocks = [];

        // Create the four cache blocks that make this set
        for (let i = 0; i < 4; i++) {
            this.blocks.push(new CacheBlock());
        }
    }
}