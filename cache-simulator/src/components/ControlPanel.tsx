import { useState } from "react";

import Cache from "../simulator/Cache";
import LRU from "../simulator/policies/LRU";
import MRU from "../simulator/policies/MRU";
import SequenceGenerator from "../simulator/SequenceGenerator";

import { ReadPolicies } from "../types/ReadPolicy";
import { SequenceTypes } from "../types/SequenceType";

import type { SimulationResult } from "../types/SimulationResult";

import StatisticsPanel from "./StatisticsPanel";
import TraceLog from "./TraceLog";
import CacheGrid from "./CacheGrid";

export default function ControlPanel() {

    const [blockSize, setBlockSize] = useState(4);
    const [cacheBlocks, setCacheBlocks] = useState(16);
    const [replacement, setReplacement] = useState<"LRU" | "MRU">("LRU");
    const [readPolicy, setReadPolicy] = useState(ReadPolicies.LoadThrough);
    const [sequenceType, setSequenceType] = useState(SequenceTypes.Sequential);
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [viewMode, setViewMode] = useState<"final" | "step">("final");
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const currentStep =
        result
            ? (
                viewMode === "final"
                    ? result.steps[result.steps.length - 1]
                    : result.steps[currentStepIndex]
            )
            : undefined;

    function runSimulation() {

        const policy =
            replacement === "LRU"
                ? new LRU()
                : new MRU();

        const cache = new Cache({
            blockSize,
            cacheBlocks,
            readPolicy,
            replacementPolicy: policy
        });

        const sequence =
            SequenceGenerator.generate(
                sequenceType,
                cacheBlocks
            );

        const result = cache.runSequence(sequence);

        setResult(result);
        setCurrentStepIndex(0);

        //console.table(result.trace);
    }

    return (

        <>

            <div className="top-row">
                <div className="panel">
                    <h2>Control Panel</h2>
                    <label>
                        View Mode
                        <select
                            value={viewMode}
                            onChange={(e) =>
                                setViewMode(
                                    e.target.value as "final" | "step"
                                )
                            }
                        >
                            <option value="final">
                                Final Snapshot
                            </option>

                            <option value="step">
                                Step-by-Step
                            </option>

                        </select>

                    </label>

                    <label>
                        Block Size
                        <select
                            value={blockSize}
                            onChange={(e) =>
                                setBlockSize(Number(e.target.value))
                            }
                        >
                            <option value={2}>2</option>
                            <option value={4}>4</option>
                            <option value={8}>8</option>
                            <option value={16}>16</option>
                        </select>
                    </label>
                    <label>

                        Cache Blocks

                        <select
                            value={cacheBlocks}
                            onChange={(e) =>
                                setCacheBlocks(Number(e.target.value))
                            }
                        >

                            <option value={4}>4</option>
                            <option value={8}>8</option>
                            <option value={16}>16</option>
                            <option value={32}>32</option>
                            <option value={64}>64</option>

                        </select>

                    </label>

                    <label>
                        Replacement Policy
                        <select
                            value={replacement}
                            onChange={(e) =>
                                setReplacement(
                                    e.target.value as "LRU" | "MRU"
                                )
                            }
                        >
                            <option value="LRU">LRU</option>
                            <option value="MRU">MRU</option>
                        </select>
                    </label>

                    <label>

                        Read Policy

                        <select
                            value={readPolicy}
                            onChange={(e) =>
                                setReadPolicy(
                                    e.target.value as typeof readPolicy
                                )
                            }
                        >

                            <option value={ReadPolicies.LoadThrough}>
                                Load Through
                            </option>

                            <option value={ReadPolicies.NonLoadThrough}>
                                Non-Load Through
                            </option>

                        </select>

                    </label>

                    <label>

                        Test Sequence

                        <select
                            value={sequenceType}
                            onChange={(e) =>
                                setSequenceType(
                                    e.target.value as typeof sequenceType
                                )
                            }
                        >

                            <option value={SequenceTypes.Sequential}>
                                Sequential
                            </option>

                            <option value={SequenceTypes.MidRepeat}>
                                Mid Repeat
                            </option>

                            <option value={SequenceTypes.Random}>
                                Random
                            </option>

                        </select>

                    </label>

                    <button onClick={runSimulation}>
                        Run Simulation
                    </button>

                    {viewMode === "step" && result && (

                        <div style={{ marginTop: "15px" }}>

                            <button
                                onClick={() =>
                                    setCurrentStepIndex(i =>
                                        Math.max(0, i - 1)
                                    )
                                }
                            >
                                ◀ Previous
                            </button>

                            <p>
                                Step {currentStepIndex + 1}
                                {" / "}
                                {result.steps.length}
                            </p>

                            <button
                                onClick={() =>
                                    setCurrentStepIndex(i =>
                                        Math.min(
                                            result.steps.length - 1,
                                            i + 1
                                        )
                                    )
                                }
                            >
                                Next ▶
                            </button>

                        </div>

                    )}

                </div>

                <div className="panel">

                    <StatisticsPanel
                        statistics={result?.statistics ?? null}
                    />

                </div>

            </div>

            <div className="full-width">

                <CacheGrid
                    cacheState={currentStep?.cacheState ?? []}
                />

            </div>

            <div className="full-width">

                <TraceLog
                    trace={result?.steps.map(step => step.trace) ?? []}
                    currentStep={currentStepIndex}
                    highlight={viewMode === "step"}
                />

            </div>

        </>

    );
}