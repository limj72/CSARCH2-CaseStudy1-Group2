import type { SimulationStep } from "./SimulationStep";
import Statistics from "../simulator/Statistics";

export interface SimulationResult {
    steps: SimulationStep[];
    statistics: Statistics;
}