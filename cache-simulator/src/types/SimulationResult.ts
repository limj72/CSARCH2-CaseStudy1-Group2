import type { AccessTrace } from "./AccessTrace";
import Statistics from "../simulator/Statistics";
import CacheSet from "../simulator/CacheSet";

export interface SimulationResult {
    trace: AccessTrace[];
    statistics: Statistics;
    cacheState: CacheSet[];
}