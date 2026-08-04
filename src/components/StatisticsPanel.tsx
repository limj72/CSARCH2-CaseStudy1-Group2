import Statistics from "../simulator/Statistics";

interface StatisticsPanelProps {
    statistics: Statistics | null;
    policyLabel?: string;
    accentColor?: string;
    hideHeader?: boolean;
}

export default function StatisticsPanel({
    statistics,
    policyLabel,
    accentColor,
    hideHeader,
}: StatisticsPanelProps) {

    const policyBadge = policyLabel && (
        <span
            className="badge"
            style={{
                marginLeft: "0.6rem",
                background: accentColor ? `${accentColor}22` : undefined,
                color: accentColor,
                borderColor: accentColor ? `${accentColor}55` : undefined,
            }}
        >
            {policyLabel}
        </span>
    );

    if (!statistics) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className="section-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10"></line>
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="14"></line>
                        </svg>
                        Performance Metrics
                        {policyBadge}
                    </h2>
                )}
                <div className="stats-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 3v18h18"></path>
                        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                    </svg>
                    <p>Run a simulation to generate statistics & timing models</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {!hideHeader && (
                <h2 className="section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    Performance Metrics & Analysis
                    {policyBadge}
                </h2>
            )}
            {hideHeader && policyBadge && (
                <div style={{ marginBottom: "0.75rem" }}>{policyBadge}</div>
            )}

            <div className="stats-sections-grid">
                
                {/* 1. Hit/Miss Rate Summary */}
                <div className="stats-group">
                    <div className="stats-group-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        Cache Hit / Miss Ratio
                    </div>

                    <div className="metrics-row">
                        <div className="stat-item">
                            <div className="val">{statistics.accesses}</div>
                            <div className="lbl">Total Requests</div>
                        </div>

                        <div className="stat-item hit-card">
                            <div className="val">{statistics.hits}</div>
                            <div className="lbl">Hits</div>
                        </div>

                        <div className="stat-item miss-card">
                            <div className="val">{statistics.misses}</div>
                            <div className="lbl">Misses</div>
                        </div>

                        <div className="stat-item highlight-card">
                            <div className="val">
                                {(statistics.hitRate * 100).toFixed(1)}%
                            </div>
                            <div className="lbl">Hit Rate</div>
                        </div>

                        <div className="stat-item">
                            <div className="val">
                                {(statistics.missRate * 100).toFixed(1)}%
                            </div>
                            <div className="lbl">Miss Rate</div>
                        </div>
                    </div>
                </div>

                {/* 2. Timing & Delay Analysis */}
                <div className="stats-group">
                    <div className="stats-group-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Memory Access Time (Cycles)
                    </div>

                    <div className="timing-badge-list">
                        <div className="timing-row">
                            <span className="t-lbl">Miss Penalty</span>
                            <span className="t-val">{statistics.missPenalty} cycles</span>
                        </div>

                        <div className="timing-row">
                            <span className="t-lbl">Average Memory Access Time (AMAT)</span>
                            <span className="t-val">{statistics.averageMemoryAccessTime.toFixed(2)} cycles</span>
                        </div>

                        <div className="timing-row">
                            <span className="t-lbl">Total Memory Access Time</span>
                            <span className="t-val">{statistics.totalMemoryAccessTime.toFixed(2)} cycles</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}