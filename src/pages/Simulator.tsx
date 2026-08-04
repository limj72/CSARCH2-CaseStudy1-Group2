import "../App.css";
import ControlPanel from "../components/ControlPanel";

export default function Simulator() {

    return (

        <main>

            <header className="app-header">
                <div className="brand-section">
                    <h1>Machine 7 · Cache Simulator</h1>
                    <div className="subtitle">
                        <span>4-Way Block Set Associative (BSA)</span>
                        <span>•</span>
                        <span>LRU vs MRU Comparison</span>
                    </div>
                </div>

                <div className="header-badges">
                    <button
                        className="btn-print-report"
                        onClick={() => window.print()}
                        title="Print or Save simulation report as PDF"
                    >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                        Export / Print PDF
                    </button>
                    <div className="badge badge-speed-highlight">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                        Adjustable Speed & Multi-Panel View
                    </div>
                    <div className="badge">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                        CSARCH2
                    </div>
                    <div className="badge badge-outline">
                        1024 Memory Blocks
                    </div>
                </div>
            </header>

            <ControlPanel />

        </main>

    );

}