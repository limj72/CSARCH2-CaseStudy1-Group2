import { useState, useEffect, useRef } from "react";

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
    const [viewMode, setViewMode] = useState<"final" | "step">("step");
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(600); // ms per step

    const timerRef = useRef<number | null>(null);

    const currentStep =
        result
            ? (
                viewMode === "final"
                    ? result.steps[result.steps.length - 1]
                    : result.steps[currentStepIndex]
            )
            : undefined;

    function runSimulation() {
        setIsPlaying(false);
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

        const simResult = cache.runSequence(sequence);

        setResult(simResult);
        setCurrentStepIndex(0);
    }

    // Auto-play interval handling
    useEffect(() => {
        if (isPlaying && result) {
            timerRef.current = window.setInterval(() => {
                setCurrentStepIndex((prevIndex) => {
                    if (prevIndex >= result.steps.length - 1) {
                        setIsPlaying(false);
                        return prevIndex;
                    }
                    return prevIndex + 1;
                });
            }, playSpeed);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isPlaying, result, playSpeed]);

    const activeTraceResult = currentStep?.trace.result;
    const isAtEnd = result ? currentStepIndex >= result.steps.length - 1 : false;

    function handlePlayToggle() {
        if (isAtEnd) {
            setCurrentStepIndex(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(!isPlaying);
        }
    }

    function handleReset() {
        setIsPlaying(false);
        setCurrentStepIndex(0);
    }

    return (
        <>
            {/* Top Row: System Parameters (Left) & Statistics Dashboard (Right) */}
            <div className="main-layout section-margin">

                {/* Configuration Controls */}
                <div className="glass-card">
                    <h2 className="section-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        System Parameters
                    </h2>

                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Visualization View Mode</label>
                            <select
                                value={viewMode}
                                onChange={(e) => {
                                    setIsPlaying(false);
                                    setViewMode(e.target.value as "final" | "step");
                                }}
                            >
                                <option value="step">Step-by-Step Animated Trace</option>
                                <option value="final">Final Memory Snapshot</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Block Size (words)</label>
                            <select
                                value={blockSize}
                                onChange={(e) =>
                                    setBlockSize(Number(e.target.value))
                                }
                            >
                                <option value={2}>2 words</option>
                                <option value={4}>4 words</option>
                                <option value={8}>8 words</option>
                                <option value={16}>16 words</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Cache Blocks (n)</label>
                            <select
                                value={cacheBlocks}
                                onChange={(e) =>
                                    setCacheBlocks(Number(e.target.value))
                                }
                            >
                                <option value={4}>4 blocks</option>
                                <option value={8}>8 blocks</option>
                                <option value={16}>16 blocks</option>
                                <option value={32}>32 blocks</option>
                                <option value={64}>64 blocks</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Replacement Policy</label>
                            <select
                                value={replacement}
                                onChange={(e) =>
                                    setReplacement(e.target.value as "LRU" | "MRU")
                                }
                            >
                                <option value="LRU">LRU — Least Recently Used</option>
                                <option value="MRU">MRU — Most Recently Used</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Read Policy</label>
                            <select
                                value={readPolicy}
                                onChange={(e) =>
                                    setReadPolicy(e.target.value as typeof readPolicy)
                                }
                            >
                                <option value={ReadPolicies.LoadThrough}>
                                    Load Through
                                </option>
                                <option value={ReadPolicies.NonLoadThrough}>
                                    Non-Load Through
                                </option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Test Sequence Pattern</label>
                            <select
                                value={sequenceType}
                                onChange={(e) =>
                                    setSequenceType(e.target.value as typeof sequenceType)
                                }
                            >
                                <option value={SequenceTypes.Sequential}>
                                    Sequential (2n blocks × 2)
                                </option>
                                <option value={SequenceTypes.MidRepeat}>
                                    Mid-Repeat Blocks (Forward & Reverse)
                                </option>
                                <option value={SequenceTypes.Random}>
                                    Random (64 block accesses)
                                </option>
                            </select>
                        </div>
                    </div>

                    <button className="btn-primary" onClick={runSimulation}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Run Simulation
                    </button>
                </div>

                {/* Statistics Dashboard Panel */}
                <div className="glass-card">
                    <StatisticsPanel
                        statistics={result?.statistics ?? null}
                    />
                </div>

            </div>

            {/* Step Playback Toolbar */}
            {viewMode === "step" && result && (
                <div className="glass-card playback-card section-margin">
                    <div className="playback-bar">
                        
                        {/* Step Details Pill */}
                        <div className="playback-status-group">
                            <span className="step-badge">
                                STEP {currentStepIndex + 1} / {result.steps.length}
                            </span>

                            {activeTraceResult && (
                                <div className="step-info-pill">
                                    <span>Accessing Block <strong>#{activeTraceResult.memoryBlock}</strong></span>
                                    <span className="dot">•</span>
                                    <span>Set {activeTraceResult.setIndex}</span>
                                    <span className="dot">•</span>
                                    <span>Tag {activeTraceResult.tag}</span>
                                    <span className={activeTraceResult.hit ? "pill pill-hit" : "pill pill-miss"}>
                                        {activeTraceResult.hit ? "HIT" : "MISS"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Playback Controls (SVG Icons ONLY) */}
                        <div className="playback-controls">
                            <button
                                className="btn-icon"
                                title="Reset to Step 1"
                                onClick={handleReset}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="23 4 23 10 17 10"></polyline>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                </svg>
                            </button>

                            <button
                                className="btn-icon"
                                title="First Step"
                                onClick={() => {
                                    setIsPlaying(false);
                                    setCurrentStepIndex(0);
                                }}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polygon points="19 20 9 12 19 4 19 20"></polygon>
                                    <line x1="5" y1="19" x2="5" y2="5"></line>
                                </svg>
                            </button>

                            <button
                                className="btn-icon"
                                title="Previous Step"
                                onClick={() => {
                                    setIsPlaying(false);
                                    setCurrentStepIndex(i => Math.max(0, i - 1));
                                }}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>

                            <button
                                className="btn-play-toggle"
                                onClick={handlePlayToggle}
                            >
                                {isPlaying ? (
                                    <>
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                            <rect x="6" y="4" width="4" height="16"></rect>
                                            <rect x="14" y="4" width="4" height="16"></rect>
                                        </svg>
                                        Pause
                                    </>
                                ) : isAtEnd ? (
                                    <>
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="23 4 23 10 17 10"></polyline>
                                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                        </svg>
                                        Replay
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                        </svg>
                                        Auto Play
                                    </>
                                )}
                            </button>

                            <button
                                className="btn-icon"
                                title="Next Step"
                                onClick={() => {
                                    setIsPlaying(false);
                                    setCurrentStepIndex(i => Math.min(result.steps.length - 1, i + 1));
                                }}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>

                            <button
                                className="btn-icon"
                                title="Last Step"
                                onClick={() => {
                                    setIsPlaying(false);
                                    setCurrentStepIndex(result.steps.length - 1);
                                }}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polygon points="5 4 15 12 5 20 5 4"></polygon>
                                    <line x1="19" y1="5" x2="19" y2="19"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Speed Selector */}
                        <div className="speed-selector">
                            <label>Speed</label>
                            <select
                                value={playSpeed}
                                onChange={(e) => setPlaySpeed(Number(e.target.value))}
                            >
                                <option value={1000}>1.0s</option>
                                <option value={600}>0.6s</option>
                                <option value={300}>0.3s</option>
                                <option value={100}>0.1s</option>
                            </select>
                        </div>

                    </div>

                    {/* Step Scrubber Progress Bar */}
                    <div className="scrubber-container">
                        <input
                            type="range"
                            min="0"
                            max={result.steps.length - 1}
                            value={currentStepIndex}
                            onChange={(e) => {
                                setIsPlaying(false);
                                setCurrentStepIndex(Number(e.target.value));
                            }}
                            className="scrubber-slider"
                        />
                    </div>
                </div>
            )}

            {/* Side-by-Side Visualizer & Trace Grid */}
            <div className="visualizer-grid section-margin">
                
                {/* Left Column: Cache Snapshot */}
                <div className="glass-card">
                    <CacheGrid
                        cacheState={currentStep?.cacheState ?? []}
                        activeResult={viewMode === "step" ? activeTraceResult : undefined}
                    />
                </div>

                {/* Right Column: Trace Execution Log */}
                <div className="glass-card">
                    <TraceLog
                        trace={result?.steps.map(step => step.trace) ?? []}
                        currentStep={currentStepIndex}
                        highlight={viewMode === "step"}
                    />
                </div>

            </div>
        </>
    );
}