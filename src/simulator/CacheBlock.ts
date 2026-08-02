export default class CacheBlock {
    tag: number | null;

    valid: boolean;

    memoryBlock: number | null;

    lastAccess: number;

    constructor() {
        this.tag = null;
        this.valid = false;
        this.memoryBlock = null;
        this.lastAccess = 0;
    }

    clear() {
        this.tag = null;
        this.valid = false;
        this.memoryBlock = null;
        this.lastAccess = 0;
    }

    // Creates a "deep copy" of this cache block:
    // Saves snapshots of cache after each memory access
    // so future changes do not affect previos simulation states
    clone(): CacheBlock {

        const copy = new CacheBlock();

        copy.tag = this.tag;
        copy.valid = this.valid;
        copy.memoryBlock = this.memoryBlock;
        copy.lastAccess = this.lastAccess;

        return copy;

    }
}