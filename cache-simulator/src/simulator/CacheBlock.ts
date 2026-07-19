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
}