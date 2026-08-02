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

    private static generateSequential(n: number): number[] {

        const sequence: number[] = [];

        for (let repeat = 0; repeat < 2; repeat++) {

            for (let i = 0; i < 2 * n; i++) {

                sequence.push(i);

            }

        }

        return sequence;

    }

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