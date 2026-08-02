import { SequenceTypes } from "../types/SequenceType";
import type { SequenceType } from "../types/SequenceType";

export default class SequenceGenerator {

    static generate(
        type: SequenceType,
        cacheBlocks: number
    ): number[] {
        switch (type) {
            case SequenceTypes.Sequential:
                return this.generateSequential(cacheBlocks);
            case SequenceTypes.MidRepeat:
                return this.generateMidRepeat(cacheBlocks);
            case SequenceTypes.Random:
                return this.generateRandom();
            default:
                return [];
        }
    }

    // Access up to 2n cache blocks, repeats twice
    private static generateSequential(n: number): number[] {
        const sequence: number[] = [];
        for (let repeat = 0; repeat < 2; repeat++) {
            for (let i = 0; i < 2 * n; i++) {
                sequence.push(i);
            }
        }

        return sequence;
    }

    // Start at block 0 to n-1, then repeat the sequence up to 2n-1 twice
    // Then, reverse sequence
    private static generateMidRepeat(n: number): number[] {
        const sequence: number[] = [];
        for (let i = 0; i < n; i++) {
            sequence.push(i);
        }

        for (let repeat = 0; repeat < 2; repeat++) {
            for (let i = 0; i < 2 * n; i++) {
                sequence.push(i);
            }
        }

        for (let i = n - 1; i >= 0; i--) {
            sequence.push(i);
        }

        for (let repeat = 0; repeat < 2; repeat++) {
            for (let i = 2 * n - 1; i >= 0; i--) {
                sequence.push(i);
            }
        }
        return sequence;
    }

    // Random sequence of 64 block accesses
    private static generateRandom(): number[] {
        const sequence: number[] = [];
        for (let i = 0; i < 64; i++) {
            sequence.push(
                Math.floor(Math.random() * 1024)
            );
        }
        return sequence;
    }

}