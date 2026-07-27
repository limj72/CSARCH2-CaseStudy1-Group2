import Statistics from "../simulator/Statistics";

interface StatisticsPanelProps {
    statistics: Statistics | null;
}

export default function StatisticsPanel({
    statistics,
}: StatisticsPanelProps) {

    if (!statistics) {
        return (
            <div>
                <h2>Statistics</h2>
                <p>No simulation has been run.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Statistics</h2>
            <p>Total Accesses: {statistics.accesses}</p>
            <p>Hits: {statistics.hits}</p>
            <p>Misses: {statistics.misses}</p>

            <p>
                Hit Rate: {(statistics.hitRate * 100).toFixed(2)}%
            </p>

            <p>
                Miss Rate: {(statistics.missRate * 100).toFixed(2)}%
            </p>

            <p>
                Average Memory Access Time:
                {" "}
                {statistics.averageMemoryAccessTime.toFixed(2)}
            </p>

            <p>
                Total Memory Access Time:
                {" "}
                {statistics.totalMemoryAccessTime.toFixed(2)}
            </p>
        </div>
    );
}