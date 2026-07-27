import CacheSet from "../simulator/CacheSet";

interface CacheGridProps {
    cacheState: CacheSet[];
}

export default function CacheGrid({
    cacheState,
}: CacheGridProps) {

    return (
        <div>
            <h2>Cache Snapshot</h2>
            {cacheState.length === 0 ? (
                <p>No simulation has been run.</p>
            ) : (
                cacheState.map((set, setIndex) => (
                    <div
                        key={setIndex}
                        className="cache-set"
                    >
                        <h3>Set {setIndex}</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Way 0</th>
                                    <th>Way 1</th>
                                    <th>Way 2</th>
                                    <th>Way 3</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    {set.blocks.map((block, way) => (
                                        <td
                                            key={way}
                                            className="cache-block"
                                            style={{
                                                backgroundColor: block.valid
                                                    ? "#d9fdd3"
                                                    : "#f5f5f5"
                                            }}
                                        >
                                            {block.valid ? (
                                                <>
                                                    <>
                                                        <div><strong>Tag:</strong> {block.tag}</div>
                                                        <div><strong>Block:</strong> {block.memoryBlock}</div>
                                                        <div><strong>Valid:</strong> Yes</div>
                                                    </>
                                                    <br />
                                                    Block {block.memoryBlock}
                                                </>

                                            ) : (
                                                <div>Invalid</div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))
            )}
        </div>

    );

}