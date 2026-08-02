import CacheBlock from "./CacheBlock";

export default class CacheSet {
    blocks: CacheBlock[];

    constructor() {
        this.blocks = [];

        for (let i = 0; i < 4; i++) {
            this.blocks.push(new CacheBlock());
        }
    }
}