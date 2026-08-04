import { useEffect, useRef } from "react";
import type { AccessTrace } from "../types/AccessTrace";

interface TraceLogProps {
    trace: AccessTrace[];
    currentStep: number;
    highlight: boolean;
}

export default function TraceLog({ trace, currentStep, highlight }: TraceLogProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const activeRowRef = useRef<HTMLTableRowElement | null>(null);

    // Auto-scroll active step row into view strictly inside trace-container
    useEffect(() => {
        if (highlight && activeRowRef.current && containerRef.current) {
            const container = containerRef.current;
            const element = activeRowRef.current;
            const topPos = element.offsetTop - container.offsetTop;
            container.scrollTo({
                top: topPos,
                behavior: "smooth",
            });
        }
    }, [currentStep, highlight]);

    return (
        <div>
            <div className="cache-grid-header">
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Memory Access Execution Trace Log
                </h2>
                {trace.length > 0 && (
                    <div className={trace.length > 6 ? "badge badge-scrollable" : "badge badge-outline"} title="Scroll inside table to view full history">
                        {trace.length} Accesses {trace.length > 6 ? "• ↕ Scrollable" : ""}
                    </div>
                )}
            </div>

            {trace.length === 0 ? (
                <div className="stats-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    <p>Run a simulation to generate access step history</p>
                </div>
            ) : (
                <>
                    <div className="trace-container" ref={containerRef}>
                        <table className="trace-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Memory Block</th>
                                    <th>Set Index</th>
                                    <th>Tag</th>
                                    <th>Result</th>
                                    <th>Target Way</th>
                                    <th>Block Replacement</th>
                                </tr>
                            </thead>

                            <tbody>
                                {trace.map((entry, index) => {
                                    const isCurrent = highlight && currentStep === index;

                                    return (
                                        <tr
                                            key={entry.accessNumber}
                                            ref={isCurrent ? activeRowRef : null}
                                            className={isCurrent ? "highlighted" : ""}
                                        >
                                            <td>{entry.accessNumber}</td>
                                            <td><strong>#{entry.result.memoryBlock}</strong></td>
                                            <td>Set {entry.result.setIndex}</td>
                                            <td>Tag {entry.result.tag}</td>
                                            <td>
                                                <span className={
                                                    entry.result.hit ? "pill pill-hit" : "pill pill-miss"
                                                }>
                                                    {entry.result.hit ? "HIT" : "MISS"}
                                                </span>
                                            </td>
                                            <td>Way {entry.result.way}</td>
                                            <td>
                                                {entry.result.replaced ? (
                                                    <span style={{ color: "var(--miss)", fontWeight: 700 }}>
                                                        Evicted Block #{entry.result.evictedBlock ?? "?"}
                                                    </span>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {trace.length > 6 && (
                        <div className="scroll-hint-footer">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="7 13 12 18 17 13"></polyline>
                                <polyline points="7 6 12 11 17 6"></polyline>
                            </svg>
                            <span>Scroll table above to view all {trace.length} access trace entries</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );

}