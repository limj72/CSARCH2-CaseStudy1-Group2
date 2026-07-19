import ControlPanel from "../components/ControlPanel";
import CacheGrid from "../components/CacheGrid";
import StatisticsPanel from "../components/StatisticsPanel";
import TraceLog from "../components/TraceLog";

export default function Simulator() {
    return (
        <main>
            <h1>Cache Memory Simulator</h1>

            <ControlPanel />
            <CacheGrid />
            <StatisticsPanel />
            <TraceLog />
        </main>
    );
}