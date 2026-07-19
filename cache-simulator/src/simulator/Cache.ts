import CacheSet from "./CacheSet";
import type ReplacementPolicy from "./ReplacementPolicy";
import Statistics from "./Statistics";

export default class Cache {

    sets: CacheSet[];

    policy: ReplacementPolicy;

    statistics: Statistics;

    constructor(numberOfSets: number, policy: ReplacementPolicy) {

        this.policy = policy;

        this.statistics = new Statistics();

        this.sets = [];

        for (let i = 0; i < numberOfSets; i++) {
            this.sets.push(new CacheSet());
        }

    }

}