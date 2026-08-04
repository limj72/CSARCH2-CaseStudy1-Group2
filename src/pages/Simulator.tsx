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
                    <div className="badge group-members-dropdown">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Group 2 Members ▼
                        <div className="dropdown-content">
                            <span>Alec Nono</span>
                            <span>Hannah Lee</span>
                            <span>Justin Lim</span>
                            <span>Mariel Yasumuro</span>
                            <span>Matthew Fabregas</span>
                        </div>
                    </div>
                    
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