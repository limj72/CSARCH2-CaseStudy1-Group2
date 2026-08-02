import type { AccessTrace } from "./AccessTrace";
import CacheSet from "../simulator/CacheSet";

export interface SimulationStep {
    trace: AccessTrace;
    cacheState: CacheSet[];
}