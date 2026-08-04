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
import PDFReportModal from "./PDFReportModal";

export default function ControlPanel() {

    const [blockSize, setBlockSize] = useState(4);
    const [cacheBlocks, setCacheBlocks] = useState(16);
    const [readPolicy, setReadPolicy] = useState(ReadPolicies.LoadThrough);
    const [sequenceType, setSequenceType] = useState(SequenceTypes.Sequential);
    const [resultLRU, setResultLRU] = useState<SimulationResult | null>(null);
    const [resultMRU, setResultMRU] = useState<SimulationResult | null>(null);
    const [viewMode, setViewMode] = useState<"final" | "step">("step");
    const [displayPolicy, setDisplayPolicy] = useState<"both" | "lru" | "mru">("both");
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(600); // ms per step
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const timerRef = useRef<number | null>(null);

    // Both policies run against the identical access sequence, so their
    // step counts always match — either result can be used as the
    // canonical source of truth for playback length.
    const totalSteps = resultLRU?.steps.length ?? 0;

    const currentStepLRU =
        resultLRU
            ? (
                viewMode === "final"
                    ? resultLRU.steps[resultLRU.steps.length - 1]
                    : resultLRU.steps[currentStepIndex]
            )
            : undefined;

    const currentStepMRU =
        resultMRU
            ? (
                viewMode === "final"
                    ? resultMRU.steps[resultMRU.steps.length - 1]
                    : resultMRU.steps[currentStepIndex]
            )
            : undefined;

    function runSimulation() {
        setIsPlaying(false);

        // Generate a single access sequence and replay it against both
        // policies so the comparison is a true apples-to-apples run.
        const sequence =
            SequenceGenerator.generate(
                sequenceType,
                cacheBlocks
            );

        const lruCache = new Cache({
            blockSize,
            cacheBlocks,
            readPolicy,
            replacementPolicy: new LRU()
        });

        const mruCache = new Cache({
            blockSize,
            cacheBlocks,
            readPolicy,
            replacementPolicy: new MRU()
        });

        setResultLRU(lruCache.runSequence(sequence));
        setResultMRU(mruCache.runSequence(sequence));
        setCurrentStepIndex(0);

        // Jump straight into the animated trace so the user sees it run
        // immediately instead of having to press Auto Play separately.
        if (viewMode === "step") {
            setIsPlaying(true);
        }
    }

    // Auto-play interval handling
    useEffect(() => {
        if (isPlaying && totalSteps > 0) {
            timerRef.current = window.setInterval(() => {
                setCurrentStepIndex((prevIndex) => {
                    if (prevIndex >= totalSteps - 1) {
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
    }, [isPlaying, totalSteps, playSpeed]);

    // Both caches see the same block/set/tag per step (identical sequence);
    // only hit/miss and the chosen way can differ between LRU and MRU.
    const activeTraceLRU = currentStepLRU?.trace.result;
    const activeTraceMRU = currentStepMRU?.trace.result;
    const isAtEnd = totalSteps > 0 ? currentStepIndex >= totalSteps - 1 : false;

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

                        <div className="form-group full-width">
                            <label>Policy Selection (Visible Panel)</label>
                            <select
                                value={displayPolicy}
                                onChange={(e) => setDisplayPolicy(e.target.value as "both" | "lru" | "mru")}
                            >
                                <option value="both">Compare Both (LRU & MRU Side-by-Side)</option>
                                <option value="lru">LRU Only (Least Recently Used)</option>
                                <option value="mru">MRU Only (Most Recently Used)</option>
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

                    <div style={{ display: "flex", gap: "8px", marginTop: "14px", marginBottom: "4px" }}>
                        <button
                            className="btn-primary"
                            onClick={runSimulation}
                            style={{
                                flex: 1,
                                padding: "9px 12px",
                                fontSize: "0.76rem",
                                marginTop: 0,
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            Run Simulation
                        </button>
                        {resultLRU && resultMRU && (
                            <button
                                className="btn-primary"
                                onClick={() => setIsReportModalOpen(true)}
                                style={{
                                    flex: 1,
                                    padding: "9px 12px",
                                    fontSize: "0.76rem",
                                    marginTop: 0,
                                    background: "var(--secondary)",
                                }}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                                PDF Report Builder
                            </button>
                        )}
                    </div>
                </div>

                {/* Statistics Dashboard Panel — LRU vs MRU side by side */}
                <div className="glass-card">
                    <h2 className="section-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10"></line>
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="14"></line>
                        </svg>
                        Performance Metrics
                    </h2>

                    {!resultLRU && !resultMRU ? (
                        <div className="stats-empty">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 3v18h18"></path>
                                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                            </svg>
                            <p>Run a simulation to generate statistics & timing models for both policies</p>
                        </div>
                    ) : (
                        <div className="policy-compare-grid">
                            {(displayPolicy === "both" || displayPolicy === "lru") && (
                                <StatisticsPanel
                                    statistics={resultLRU?.statistics ?? null}
                                    policyLabel="LRU — Least Recently Used Policy"
                                    accentColor="#047857"
                                    hideHeader
                                />
                            )}
                            {(displayPolicy === "both" || displayPolicy === "mru") && (
                                <StatisticsPanel
                                    statistics={resultMRU?.statistics ?? null}
                                    policyLabel="MRU — Most Recently Used Policy"
                                    accentColor="#6d28d9"
                                    hideHeader
                                />
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* Step Playback Toolbar */}
            {viewMode === "step" && totalSteps > 0 && (
                <div className="glass-card playback-card section-margin">
                    <div className="playback-bar">
                        
                        {/* Step Details Pill */}
                        <div className="playback-status-group">
                            <span className="step-badge">
                                STEP {currentStepIndex + 1} / {totalSteps}
                            </span>

                            {activeTraceLRU && (
                                <div className="step-info-pill">
                                    <span>Accessing Block <strong>#{activeTraceLRU.memoryBlock}</strong> <span style={{ opacity: 0.7, fontSize: "0.75rem" }}>(Words W{activeTraceLRU.memoryBlock * blockSize}–W{(activeTraceLRU.memoryBlock + 1) * blockSize - 1})</span></span>
                                    <span className="dot">•</span>
                                    <span>Set {activeTraceLRU.setIndex}</span>
                                    <span className="dot">•</span>
                                    <span>Tag {activeTraceLRU.tag}</span>
                                    {(displayPolicy === "both" || displayPolicy === "lru") && (
                                        <>
                                            <span className="dot">•</span>
                                            <span style={{ opacity: 0.8 }}>LRU</span>
                                            <span className={activeTraceLRU.hit ? "pill pill-hit" : "pill pill-miss"}>
                                                {activeTraceLRU.hit ? "HIT" : "MISS"}
                                            </span>
                                        </>
                                    )}
                                    {(displayPolicy === "both" || displayPolicy === "mru") && activeTraceMRU && (
                                        <>
                                            <span className="dot">•</span>
                                            <span style={{ opacity: 0.8 }}>MRU</span>
                                            <span className={activeTraceMRU.hit ? "pill pill-hit" : "pill pill-miss"}>
                                                {activeTraceMRU.hit ? "HIT" : "MISS"}
                                            </span>
                                        </>
                                    )}
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
                                        <span className="goomba-spinner" title="Simulation Playing..."></span>
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
                                    setCurrentStepIndex(i => Math.min(totalSteps - 1, i + 1));
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
                                    setCurrentStepIndex(totalSteps - 1);
                                }}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polygon points="5 4 15 12 5 20 5 4"></polygon>
                                    <line x1="19" y1="5" x2="19" y2="19"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Prominent Speed Selector */}
                        <div className="speed-selector-highlight">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                            <label htmlFor="playback-speed-select">SIMULATION SPEED:</label>
                            <select
                                id="playback-speed-select"
                                value={playSpeed}
                                onChange={(e) => setPlaySpeed(Number(e.target.value))}
                                className="speed-select-input"
                            >
                                <option value={1000}>1.0s (Slow)</option>
                                <option value={600}>0.6s (Normal)</option>
                                <option value={300}>0.3s (Fast)</option>
                                <option value={100}>0.1s (Ultra Fast)</option>
                            </select>
                        </div>

                    </div>

                    {/* Step Scrubber Progress Bar */}
                    <div className="scrubber-container">
                        <input
                            type="range"
                            min="0"
                            max={totalSteps - 1}
                            value={currentStepIndex}
                            onChange={(e) => {
                                setIsPlaying(false);
                                setCurrentStepIndex(Number(e.target.value));
                            }}
                            className={`scrubber-slider ${isPlaying ? "is-playing" : ""}`}
                            style={{ '--progress': `${totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0}%` } as React.CSSProperties}
                        />
                    </div>
                </div>
            )}

            {/* Visualizer & Trace Section */}
            {displayPolicy === "both" ? (
                /* Compare Both Mode: LRU (left column) vs MRU (right column) */
                <div
                    className="visualizer-grid section-margin"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1.5rem",
                        alignItems: "start",
                    }}
                >
                    {/* Left Column: LRU */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: 0 }}>
                        <div className="glass-card">
                            <CacheGrid
                                cacheState={currentStepLRU?.cacheState ?? []}
                                activeResult={viewMode === "step" ? activeTraceLRU : undefined}
                                blockSize={blockSize}
                                policyLabel="LRU (Least Recently Used)"
                                accentColor="#047857"
                            />
                        </div>

                        <div className="glass-card">
                            <TraceLog
                                trace={resultLRU?.steps.map(step => step.trace) ?? []}
                                currentStep={currentStepIndex}
                                highlight={viewMode === "step"}
                            />
                        </div>
                    </div>

                    {/* Right Column: MRU */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: 0 }}>
                        <div className="glass-card">
                            <CacheGrid
                                cacheState={currentStepMRU?.cacheState ?? []}
                                activeResult={viewMode === "step" ? activeTraceMRU : undefined}
                                blockSize={blockSize}
                                policyLabel="MRU (Most Recently Used)"
                                accentColor="#6d28d9"
                            />
                        </div>

                        <div className="glass-card">
                            <TraceLog
                                trace={resultMRU?.steps.map(step => step.trace) ?? []}
                                currentStep={currentStepIndex}
                                highlight={viewMode === "step"}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                /* Single Policy Mode (LRU Only or MRU Only): Cache Grid (Left) & Trace Log (Right) Side-by-Side */
                <div
                    className="visualizer-grid section-margin"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.15fr 0.85fr",
                        gap: "1.5rem",
                        alignItems: "start",
                    }}
                >
                    <div className="glass-card">
                        <CacheGrid
                            cacheState={
                                displayPolicy === "lru"
                                    ? currentStepLRU?.cacheState ?? []
                                    : currentStepMRU?.cacheState ?? []
                            }
                            activeResult={
                                viewMode === "step"
                                    ? (displayPolicy === "lru" ? activeTraceLRU : activeTraceMRU)
                                    : undefined
                            }
                            blockSize={blockSize}
                            policyLabel={
                                displayPolicy === "lru"
                                    ? "LRU (Least Recently Used)"
                                    : "MRU (Most Recently Used)"
                            }
                            accentColor={displayPolicy === "lru" ? "#047857" : "#6d28d9"}
                        />
                    </div>

                    <div className="glass-card">
                        <TraceLog
                            trace={
                                displayPolicy === "lru"
                                    ? resultLRU?.steps.map(step => step.trace) ?? []
                                    : resultMRU?.steps.map(step => step.trace) ?? []
                            }
                            currentStep={currentStepIndex}
                            highlight={viewMode === "step"}
                        />
                    </div>
                </div>
            )}
            {/* Academic PDF Report Builder Modal */}
            <PDFReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                blockSize={blockSize}
                cacheBlocks={cacheBlocks}
                readPolicy={readPolicy}
                sequenceType={sequenceType}
                displayPolicy={displayPolicy}
                resultLRU={resultLRU}
                resultMRU={resultMRU}
            />
        </>
    );
}