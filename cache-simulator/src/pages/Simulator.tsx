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
                    <div className="badge">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
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