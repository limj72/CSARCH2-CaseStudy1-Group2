import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { SimulationResult } from "../types/SimulationResult";

interface PDFReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    blockSize: number;
    cacheBlocks: number;
    readPolicy: string;
    sequenceType: string;
    displayPolicy: "both" | "lru" | "mru";
    resultLRU: SimulationResult | null;
    resultMRU: SimulationResult | null;
}

export default function PDFReportModal({
    isOpen,
    onClose,
    blockSize,
    cacheBlocks,
    readPolicy,
    sequenceType,
    displayPolicy,
    resultLRU,
    resultMRU,
}: PDFReportModalProps) {
    const [reportTitle, setReportTitle] = useState("CSARCH2 Case Study Report — Machine 7");
    const [authorName, setAuthorName] = useState("Group 2");

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("pdf-modal-open");
        } else {
            document.body.classList.remove("pdf-modal-open");
        }
        return () => {
            document.body.classList.remove("pdf-modal-open");
        };
    }, [isOpen]);

    if (!isOpen) return null;

    function handlePrintPDF() {
        setTimeout(() => {
            window.print();
        }, 100);
    }

    const lruStats = resultLRU?.statistics;
    const mruStats = resultMRU?.statistics;

    // Portal to body: the print stylesheet hides #root, so the modal must escape it.
    return createPortal(
        <div className="pdf-modal-overlay">
            <div className="pdf-modal-container">
                {/* Modal Toolbar (Hidden on Print) */}
                <div className="pdf-modal-toolbar">
                    <div className="pdf-toolbar-title">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        Academic PDF Report Builder
                    </div>
                    <div className="pdf-toolbar-actions">
                        <button className="btn-pdf-print" onClick={handlePrintPDF}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                <rect x="6" y="14" width="12" height="8"></rect>
                            </svg>
                            Generate / Print PDF
                        </button>
                        <button className="btn-pdf-close" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>

                {/* Printable Document Preview */}
                <div className="printable-academic-document">
                    
                    {/* Official Document Cover Header */}
                    <div className="doc-header-block">
                        <div className="doc-meta-badge">CSARCH2 · 3rd Term AY 2025-2026</div>
                        <input
                            type="text"
                            value={reportTitle}
                            onChange={(e) => setReportTitle(e.target.value)}
                            className="doc-title-input"
                            title="Click to edit document title"
                        />
                        <div className="doc-author-row">
                            <span>Prepared By: </span>
                            <input
                                type="text"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                className="doc-author-input"
                            />
                            <span> • Machine 7: 4-Way Block Set Associative (BSA)</span>
                        </div>
                    </div>

                    {/* Section 1: System Parameters Summary Table */}
                    <div className="doc-section">
                        <h3 className="doc-section-title">1. System Specifications & Configuration</h3>
                        <table className="doc-spec-table">
                            <tbody>
                                <tr>
                                    <td><strong>Architecture:</strong> Machine 7 (4-Way Set Associative)</td>
                                    <td><strong>Block Size:</strong> {blockSize} words ({blockSize * 4} bytes)</td>
                                </tr>
                                <tr>
                                    <td><strong>Cache Size:</strong> {cacheBlocks} blocks ({cacheBlocks / 4} Sets × 4 Ways)</td>
                                    <td><strong>Main Memory:</strong> 1024 Memory Blocks</td>
                                </tr>
                                <tr>
                                    <td><strong>Read Policy:</strong> {readPolicy}</td>
                                    <td><strong>Test Pattern:</strong> {sequenceType}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Section 2: Policy Performance Comparison / Summary */}
                    {(resultLRU || resultMRU) && (
                        <div className="doc-section">
                            <h3 className="doc-section-title">
                                2. {displayPolicy === "both" ? "LRU vs MRU Performance Comparison Summary" : `${displayPolicy.toUpperCase()} Performance Summary`}
                            </h3>
                            <table className="doc-compare-table">
                                <thead>
                                    <tr>
                                        <th>Metric Parameter</th>
                                        {(displayPolicy === "both" || displayPolicy === "lru") && lruStats && (
                                            <th>LRU (Least Recently Used)</th>
                                        )}
                                        {(displayPolicy === "both" || displayPolicy === "mru") && mruStats && (
                                            <th>MRU (Most Recently Used)</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Total Memory Requests</td>
                                        {(displayPolicy === "both" || displayPolicy === "lru") && lruStats && <td>{lruStats.accesses}</td>}
                                        {(displayPolicy === "both" || displayPolicy === "mru") && mruStats && <td>{mruStats.accesses}</td>}
                                    </tr>
                                    <tr>
                                        <td>Cache Hits / Misses</td>
                                        {(displayPolicy === "both" || displayPolicy === "lru") && lruStats && <td>{lruStats.hits} Hits / {lruStats.misses} Misses</td>}
                                        {(displayPolicy === "both" || displayPolicy === "mru") && mruStats && <td>{mruStats.hits} Hits / {mruStats.misses} Misses</td>}
                                    </tr>
                                    <tr>
                                        <td>Cache Hit Rate (%)</td>
                                        {(displayPolicy === "both" || displayPolicy === "lru") && lruStats && <td><strong>{(lruStats.hitRate * 100).toFixed(2)}%</strong></td>}
                                        {(displayPolicy === "both" || displayPolicy === "mru") && mruStats && <td><strong>{(mruStats.hitRate * 100).toFixed(2)}%</strong></td>}
                                    </tr>
                                    <tr>
                                        <td>Average Access Time (AMAT)</td>
                                        {(displayPolicy === "both" || displayPolicy === "lru") && lruStats && <td>{lruStats.averageMemoryAccessTime.toFixed(2)} cycles</td>}
                                        {(displayPolicy === "both" || displayPolicy === "mru") && mruStats && <td>{mruStats.averageMemoryAccessTime.toFixed(2)} cycles</td>}
                                    </tr>
                                    <tr>
                                        <td>Total Access Latency</td>
                                        {(displayPolicy === "both" || displayPolicy === "lru") && lruStats && <td>{lruStats.totalMemoryAccessTime.toFixed(2)} cycles</td>}
                                        {(displayPolicy === "both" || displayPolicy === "mru") && mruStats && <td>{mruStats.totalMemoryAccessTime.toFixed(2)} cycles</td>}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Section 3: Detailed Step-by-Step Access History Log */}
                    {(resultLRU || resultMRU) && (
                        <div className="doc-section">
                            <h3 className="doc-section-title">3. Execution Trace & Replacement History Log</h3>
                            <table className="doc-trace-table">
                                <thead>
                                    <tr>
                                        <th>Step #</th>
                                        <th>Requested Block</th>
                                        <th>Set Index</th>
                                        <th>Tag</th>
                                        {(displayPolicy === "both" || displayPolicy === "lru") && <th>LRU Result</th>}
                                        {(displayPolicy === "both" || displayPolicy === "lru") && <th>LRU Evicted</th>}
                                        {(displayPolicy === "both" || displayPolicy === "mru") && <th>MRU Result</th>}
                                        {(displayPolicy === "both" || displayPolicy === "mru") && <th>MRU Evicted</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(resultLRU?.steps || resultMRU?.steps || []).map((_, idx) => {
                                        const stepLRU = resultLRU?.steps[idx];
                                        const stepMRU = resultMRU?.steps[idx];
                                        const refResult = stepLRU?.trace.result || stepMRU?.trace.result;

                                        return (
                                            <tr key={idx}>
                                                <td>#{idx + 1}</td>
                                                <td><strong>Block #{refResult?.memoryBlock}</strong></td>
                                                <td>Set {refResult?.setIndex}</td>
                                                <td>Tag {refResult?.tag}</td>

                                                {(displayPolicy === "both" || displayPolicy === "lru") && stepLRU && (
                                                    <>
                                                        <td className={stepLRU.trace.result.hit ? "tag-hit" : "tag-miss"}>
                                                            {stepLRU.trace.result.hit ? "HIT" : "MISS"} (Way {stepLRU.trace.result.way})
                                                        </td>
                                                        <td>
                                                            {stepLRU.trace.result.replaced
                                                                ? `Block #${stepLRU.trace.result.evictedBlock}`
                                                                : "—"}
                                                        </td>
                                                    </>
                                                )}

                                                {(displayPolicy === "both" || displayPolicy === "mru") && stepMRU && (
                                                    <>
                                                        <td className={stepMRU.trace.result.hit ? "tag-hit" : "tag-miss"}>
                                                            {stepMRU.trace.result.hit ? "HIT" : "MISS"} (Way {stepMRU.trace.result.way})
                                                        </td>
                                                        <td>
                                                            {stepMRU.trace.result.replaced
                                                                ? `Block #${stepMRU.trace.result.evictedBlock}`
                                                                : "—"}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Section 4: Final Cache Memory State Snapshots */}
                    {(resultLRU || resultMRU) && (
                        <div className="doc-section">
                            <h3 className="doc-section-title">4. Final Cache Memory State Visual Snapshots</h3>
                            
                            <div className="doc-snapshot-comparison">
                                {/* LRU Final Snapshot Table */}
                                {(displayPolicy === "both" || displayPolicy === "lru") && resultLRU && (
                                    <div className="doc-snapshot-col">
                                        <h4 className="doc-col-title" style={{ color: "#047857" }}>LRU Policy — Final Cache State</h4>
                                        <table className="doc-snapshot-table">
                                            <thead>
                                                <tr>
                                                    <th>Set</th>
                                                    <th>Way 0</th>
                                                    <th>Way 1</th>
                                                    <th>Way 2</th>
                                                    <th>Way 3</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resultLRU.steps[resultLRU.steps.length - 1].cacheState.map((set, sIdx) => (
                                                    <tr key={sIdx}>
                                                        <td><strong>SET {sIdx}</strong></td>
                                                        {set.blocks.map((block, wIdx) => (
                                                            <td key={wIdx} className={block.valid ? "cell-occupied" : "cell-empty"}>
                                                                {block.valid ? (
                                                                    <div>
                                                                        <div><strong>Block #{block.memoryBlock}</strong></div>
                                                                        <div style={{ fontSize: "0.68rem", color: "#555" }}>Tag: {block.tag}</div>
                                                                        <div style={{ fontSize: "0.65rem", color: "#049cd8" }}>W{block.memoryBlock! * blockSize}–W{(block.memoryBlock! + 1) * blockSize - 1}</div>
                                                                    </div>
                                                                ) : (
                                                                    <span style={{ color: "#aaa" }}>Empty</span>
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* MRU Final Snapshot Table */}
                                {(displayPolicy === "both" || displayPolicy === "mru") && resultMRU && (
                                    <div className="doc-snapshot-col">
                                        <h4 className="doc-col-title" style={{ color: "#6d28d9" }}>MRU Policy — Final Cache State</h4>
                                        <table className="doc-snapshot-table">
                                            <thead>
                                                <tr>
                                                    <th>Set</th>
                                                    <th>Way 0</th>
                                                    <th>Way 1</th>
                                                    <th>Way 2</th>
                                                    <th>Way 3</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resultMRU.steps[resultMRU.steps.length - 1].cacheState.map((set, sIdx) => (
                                                    <tr key={sIdx}>
                                                        <td><strong>SET {sIdx}</strong></td>
                                                        {set.blocks.map((block, wIdx) => (
                                                            <td key={wIdx} className={block.valid ? "cell-occupied" : "cell-empty"}>
                                                                {block.valid ? (
                                                                    <div>
                                                                        <div><strong>Block #{block.memoryBlock}</strong></div>
                                                                        <div style={{ fontSize: "0.68rem", color: "#555" }}>Tag: {block.tag}</div>
                                                                        <div style={{ fontSize: "0.65rem", color: "#049cd8" }}>W{block.memoryBlock! * blockSize}–W{(block.memoryBlock! + 1) * blockSize - 1}</div>
                                                                    </div>
                                                                ) : (
                                                                    <span style={{ color: "#aaa" }}>Empty</span>
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="doc-footer">
                        <span>CSARCH2 Machine 7 Cache Simulator • Group 2</span>
                        <span>Generated: {new Date().toLocaleDateString()}</span>
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
}
