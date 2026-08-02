import CacheSet from "../simulator/CacheSet";
import type { AccessResult } from "../types/AccessResult";

interface CacheGridProps {
    cacheState: CacheSet[];
    activeResult?: AccessResult;
}

export default function CacheGrid({
    cacheState,
    activeResult,
}: CacheGridProps) {

    return (
        <div className="cache-grid-container">
            <div className="cache-grid-header">
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    Cache Memory Visual Snapshot (4-Way BSA)
                </h2>
                {cacheState.length > 0 && (
                    <div className="badge badge-outline">
                        {cacheState.length} Sets • 4 Ways / Set
                    </div>
                )}
            </div>

            {cacheState.length === 0 ? (
                <div className="stats-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    <p>Run a simulation to inspect live cache block tags & states</p>
                </div>
            ) : (
                <div className="cache-set-list">
                    {cacheState.map((set, setIndex) => {
                        const isSetTargeted = activeResult?.setIndex === setIndex;

                        return (
                            <div
                                key={setIndex}
                                className={`cache-set-row ${isSetTargeted ? "active-set" : ""}`}
                            >
                                <div className="cache-set-row-header">
                                    <span className={`set-pill ${isSetTargeted ? "targeted-pill" : ""}`}>
                                        SET {setIndex} {isSetTargeted ? "← ACCESSED" : ""}
                                    </span>
                                </div>

                                <div className="ways-grid">
                                    {set.blocks.map((block, way) => {
                                        const isWayTargeted = isSetTargeted && activeResult?.way === way;

                                        return (
                                            <div
                                                key={way}
                                                className={`way-block ${block.valid ? "occupied" : "empty"} ${
                                                    isWayTargeted
                                                        ? activeResult?.hit ? "active-way-hit" : "active-way-miss"
                                                        : ""
                                                }`}
                                            >
                                                <div className="way-num">Way {way}</div>
                                                {block.valid ? (
                                                    <>
                                                        <div className="tag-val">Tag: {block.tag}</div>
                                                        <div className="mem-val">Block #{block.memoryBlock}</div>
                                                        <div className="valid-badge">VALID</div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="tag-val" style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</div>
                                                        <div className="mem-val" style={{ opacity: 0.5 }}>Empty</div>
                                                        <div className="valid-badge">INVALID</div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

}