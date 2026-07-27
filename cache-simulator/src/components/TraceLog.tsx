import type { AccessTrace } from "../types/AccessTrace";

interface TraceLogProps {
    trace: AccessTrace[];
}

export default function TraceLog({ trace }: TraceLogProps) {

    return (

        <div>

            <h2>Memory Access Trace</h2>

            {trace.length === 0 ? (

                <p>No simulation has been run.</p>

            ) : (

                <div className="trace-container">

                    <table>

                        <thead>

                            <tr>

                                <th>#</th>
                                <th>Block</th>
                                <th>Set</th>
                                <th>Tag</th>
                                <th>Result</th>
                                <th>Way</th>
                                <th>Replaced?</th>

                            </tr>

                        </thead>

                        <tbody>

                            {trace.map((entry) => (

                                <tr key={entry.accessNumber}>

                                    <td>{entry.accessNumber}</td>

                                    <td>{entry.result.memoryBlock}</td>

                                    <td>{entry.result.setIndex}</td>

                                    <td>{entry.result.tag}</td>

                                    <td
                                        style={{
                                            color: entry.result.hit ? "green" : "red",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {entry.result.hit ? "HIT" : "MISS"}
                                    </td>

                                    <td>{entry.result.way}</td>

                                    <td>
                                        {entry.result.replaced ? "Yes" : "No"}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );

}