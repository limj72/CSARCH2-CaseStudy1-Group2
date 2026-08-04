# CSARCH2 Case Study 1: Machine 7 Cache Memory Simulator

## Deployed Link: https://limj72.github.io/CSARCH2-CaseStudy1-Group2/
## Youtube Link: 

> **Machine 7 Configuration:** 4-Way Block Set Associative (BSA) — **LRU vs. MRU Replacement Policies**

An interactive, web-based **Cache Memory Simulator** designed for CSARCH2 (Computer Architecture 2). This application simulates a **4-Way Block Set Associative (BSA)** cache memory system comparing **Least Recently Used (LRU)** and **Most Recently Used (MRU)** replacement policies, featuring real-time state visualization, step-by-step trace execution, and detailed timing statistics.

---

## Table of Contents
1. [Quick Start Guide](#quick-start-guide)
2. [Machine 7 Full Specifications & Parameters](#machine-7-full-specifications--parameters)
3. [Mathematical Timing & Metric Models](#mathematical-timing--metric-models)
4. [Detailed Analysis Write-up (LRU vs. MRU)](#detailed-analysis-write-up-lru-vs-mru)
   - [Test Case A: Sequential Sequence](#test-case-a-sequential-sequence)
   - [Test Case B: Mid-Repeat Sequence](#test-case-b-mid-repeat-sequence)
   - [Test Case C: Random Sequence](#test-case-c-random-sequence)
   - [Test Case D: Minimum Cache Size](#test-case-d-minimum-cache-size-sequential)
   - [Test Case E: Maximum Cache Size](#test-case-e-maximum-cache-size-sequential)
   - [Additional Validation: Non-Load Through](#additional-validation-non-load-through-read-policy)
   - [Comparative Summary & Architectural Insights](#comparative-summary--architectural-insights)
5. [Repository Structure](#repository-structure)

---

## Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Setup & Running Instructions

1. **Navigate to the project root directory**:
   ```bash
   cd CSARCH2-CaseStudy1-Group2
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local Vite development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your web browser and navigate to `http://localhost:5173/CSARCH2-CaseStudy1-Group2/`.

### Build & Utility Commands

From the project root:
- `npm run dev`: Launches local development server with HMR.
- `npm run build`: Compiles TypeScript and builds production assets into `dist/`.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs Oxlint code inspection.

---

## Machine 7 Full Specifications & Parameters

| Parameter | Specification / Value | Description |
| :--- | :--- | :--- |
| **Machine ID** | **Machine 7** | 4-Way Block Set Associative (BSA) |
| **Associativity** | **4-Way Set Associative** | Fixed at 4 blocks per set ($K = 4$). |
| **Main Memory Size** | **1024 Blocks** | Memory block addresses range from `0` to `1023`. |
| **Number of Cache Blocks ($n$)** | **Parameterized** | Power of 2, minimum 4 blocks (16 blocks recommended). |
| **Number of Cache Sets ($S$)** | **$S = n / 4$** | Derived automatically from total cache blocks. |
| **Block Size ($B$)** | **Parameterized** | Power of 2 (2, 4, 8, 16 words per block; minimum 2 words). |
| **Read Policy** | **Parameterized** | **Non-Load-Through** vs. **Load-Through**. |
| **Replacement Policies** | **LRU vs. MRU** | Least Recently Used vs. Most Recently Used. |
| **Cache Hit Time ($T_{\text{hit}}$)** | **1 cycle** | Time unit required to read from cache memory. |
| **Memory Word Access Time ($T_{\text{mem}}$)** | **10 cycles** | Time unit required to access a single word in main memory. |

### Address Mapping Logic (Set Associative)
For a given main memory block index $M$:
- **Set Index ($S_{\text{idx}}$)** = $M \pmod S$
- **Tag ($T$)** = $\lfloor M / S \rfloor$

---

## Mathematical Timing & Metric Models

### Required Statistical Outputs

The simulation engine measures and computes all 7 required metrics:

1. **Total Access Count** ($N$): Total memory access requests issued.
2. **Cache Hit Count** ($H$): Number of access requests satisfied by cache.
3. **Cache Miss Count** ($M$): Number of access requests that resulted in cache misses.
4. **Cache Hit Rate**: $\text{Hit Rate}=\frac{H}{N}$
5. **Cache Miss Rate**: $\text{Miss Rate}=\frac{M}{N}=1-\text{Hit Rate}$
6. **Average Memory Access Time (AMAT)**: $\text{AMAT}=(T_{\text{hit}}\times\text{Hit Rate})+(\text{Miss Penalty}\times\text{Miss Rate})$
7. **Total Memory Access Time**: $\text{Total Access Time}=\text{AMAT}\times N$

---

### Read Policy Miss Penalty Formulas

* **Non-Load-Through Policy**:
  When a cache miss occurs, the CPU must wait while the entire main memory block ($B$ words) is transferred into the cache before reading the target word from cache.
  
  $$
  \text{Miss Penalty}_{\text{Non-Load}} = T_{\text{hit}} + (B \times T_{\text{mem}}) + T_{\text{hit}}
  $$

> For $B = 4$ words, $T_{\text{hit}} = 1$, and $T_{\text{mem}} = 10$: $\text{Miss Penalty} = 1 + (4 \times 10) + 1 = 42\text{ cycles}$.

* **Load-Through Policy**:
  When a cache miss occurs, the requested word is forwarded directly from main memory to the CPU while the block is loaded into cache in parallel.
  
  $$
  \text{Miss Penalty}_{\text{Load}} = T_{\text{hit}} + T_{\text{mem}}
  $$

> For $T_{\text{hit}} = 1$ and $T_{\text{mem}} = 10$: $\text{Miss Penalty} = 1 + 10 = 11\text{ cycles}$.
---

## Detailed Analysis Write-up (LRU vs. MRU)

The following benchmark analysis compares **4-Way BSA + LRU** against **4-Way BSA + MRU** across the three standard test sequences with $n = 16$ cache blocks (4 sets of 4 ways each) and block size $B = 4$ words.

---
### Test Case A: Sequential Sequence

- **Pattern Definition**: Access up to $2n = 32$ cache blocks ($0, 1, 2, \dots, 31$) and repeat the sequence twice.
- **Total Accesses**: 64 memory block accesses.
- **Working Set**: 32 distinct memory blocks mapped across 4 cache sets, with 8 different blocks competing for the 4 ways in each set.
- **Configuration Used**:
  - Block Size: 4 words
  - Cache Blocks: 16 blocks
  - Number of Sets: 4
  - Main Memory Size: 1024 blocks

#### Benchmark Results

| Replacement Policy | Read Policy | Total Accesses | Hits | Misses | Hit Rate | Miss Rate | AMAT (cycles) | Total Access Time (cycles) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **LRU** | Load-Through | 64 | 0 | 64 | **0.00%** | **100.00%** | 11.00 | 704.00 |
| **MRU** | Load-Through | 64 | 16 | 48 | **25.00%** | **75.00%** | 8.50 | 544.00 |
| **LRU** | Non-Load-Through | 64 | 0 | 64 | **0.00%** | **100.00%** | 42.00 | 2,688.00 |
| **MRU** | Non-Load-Through | 64 | 16 | 48 | **25.00%** | **75.00%** | 31.75 | 2,032.00 |

#### LRU Simulation Output
![alt text](screenshots/LRU_sequential.png)

#### MRU Simulation Output
![alt text](screenshots/MRU_sequential.png)

#### Analysis

The sequential access sequence uses a working set of $2n = 32$ blocks, which is twice the cache capacity of $n = 16$ blocks.

- **LRU Behavior — 0.00% Hit Rate**: LRU removes the block that has not been accessed for the longest time. During the first pass from block $0$ to block $31$, the earlier blocks are gradually removed from the cache. When the sequence returns to block $0$ during the second pass, it is no longer available in the cache. The same behavior continues for every block, causing complete cache thrashing and producing 64 misses.

- **MRU Behavior — 25.00% Hit Rate**: MRU removes the most recently accessed block whenever a set is full. For example, blocks $0$, $4$, $8$, and $12$ initially fill Set 0. When another block mapped to Set 0 is accessed, MRU removes the most recently inserted block while preserving older blocks. As a result, several early blocks remain in the cache and produce 16 hits during the second pass.

- **Read Policy Comparison**: Load-Through and Non-Load-Through produce the same number of hits and misses because the read policy does not affect cache replacement. However, Non-Load-Through has a higher miss penalty because the entire block must be transferred before the requested word can be accessed.


---

### Test Case B: Mid-Repeat Sequence

- **Pattern Definition**:
  1. Access blocks $0$ to $n-1$ or $0$ to $15$.
  2. Access blocks $0$ to $2n-1$ or $0$ to $31$ twice.
  3. Access blocks $n-1$ to $0$ or $15$ to $0$ in reverse.
  4. Access blocks $2n-1$ to $0$ or $31$ to $0$ twice.
- **Total Accesses**: 160 memory block accesses.
- **Working Set**: The pattern alternates between a 16-block working set and a larger 32-block working set while also changing the direction of access.
- **Configuration Used**:
  - Block Size: 4 words
  - Cache Blocks: 16 blocks
  - Number of Sets: 4
  - Main Memory Size: 1024 blocks

#### Benchmark Results

| Replacement Policy | Read Policy | Total Accesses | Hits | Misses | Hit Rate | Miss Rate | AMAT (cycles) | Total Access Time (cycles) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **LRU** | Load-Through | 160 | 16 | 144 | **10.00%** | **90.00%** | 10.00 | 1,600.00 |
| **MRU** | Load-Through | 160 | 68 | 92 | **42.50%** | **57.50%** | 6.75 | 1,080.00 |
| **LRU** | Non-Load-Through | 160 | 16 | 144 | **10.00%** | **90.00%** | 37.90 | 6,064.00 |
| **MRU** | Non-Load-Through | 160 | 68 | 92 | **42.50%** | **57.50%** | 24.57 | 3,932.00 |

#### LRU Simulation Output
![alt text](screenshots/LRU_MidRep.png)

#### MRU Simulation Output
![alt text](screenshots/MRU_MidRep.png)

#### Analysis

The Mid-Repeat sequence contains forward repetitions, reverse repetitions, and changes in the size of the active working set.

- **LRU Behavior — 10.00% Hit Rate**: LRU performs poorly during the repeated $0$ to $31$ sequences because the 32-block working set exceeds the 16-block cache capacity. Most earlier blocks are removed before they are accessed again. Some hits occur when the sequence changes direction because recently accessed blocks may still be available in the cache.

- **MRU Behavior — 42.50% Hit Rate**: MRU performs better because it repeatedly removes the newest block in a full set while allowing older blocks to remain. These retained blocks are accessed again during the repeated and reversed portions of the sequence, resulting in 68 cache hits.

- **Policy Comparison**: MRU achieves 52 more hits than LRU and reduces the total Load-Through access time from 1,600 cycles to 1,080 cycles. This shows that MRU is more suitable for this specific repeated and reversing access pattern.

- **Read Policy Comparison**: The hit and miss counts remain unchanged between the two read policies. The difference appears only in AMAT and total access time because Non-Load-Through has a substantially higher miss penalty.

---

### Test Case C: Random Sequence

- **Pattern Definition**: Generate 64 random memory block accesses within the valid main memory range of block 0 to block 1023.
- **Total Accesses**: 64 memory block accesses.
- **Working Set**: Randomly selected blocks from 1024 possible main memory blocks.
- **Configuration Used**:
  - Visualization Mode: Final Memory Snapshot
  - Policy Selection: Compare Both LRU and MRU Side-by-Side
  - Block Size: 4 words
  - Cache Blocks: 16 blocks
  - Number of Sets: 4
  - Associativity: 4 ways per set
  - Read Policy: Load-Through
  - Main Memory Size: 1024 blocks

#### Benchmark Results

Both replacement policies were tested using the exact same randomly generated sequence, allowing a controlled comparison between LRU and MRU.

| Replacement Policy | Read Policy | Total Accesses | Hits | Misses | Hit Rate | Miss Rate | AMAT (cycles) | Total Access Time (cycles) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **LRU** | Load-Through | 64 | 1 | 63 | **1.56%** | **98.44%** | 10.84 | 694.00 |
| **MRU** | Load-Through | 64 | 0 | 64 | **0.00%** | **100.00%** | 11.00 | 704.00 |

#### LRU vs. MRU Simulation Output
![alt text](screenshots/LRU_MRU_RANDOM.png)

#### Analysis

The Random sequence accesses memory blocks from a large address space of 1024 blocks while the cache can store only 16 blocks. Because the accesses are randomly generated, the sequence has very little temporal locality. Most requested blocks are not accessed again before they are replaced, resulting in high miss rates for both policies.

- **LRU Behavior — 1.56% Hit Rate**: LRU produced 1 cache hit and 63 cache misses. One previously accessed block remained in the cache long enough to be requested again. This resulted in an average memory access time of 10.84 cycles and a total memory access time of 694 cycles.

- **MRU Behavior — 0.00% Hit Rate**: MRU produced 64 cache misses and no cache hits. Any repeated block in the sequence was no longer available when it was requested again, resulting in an average memory access time of 11.00 cycles and a total memory access time of 704 cycles.

- **Observed Performance Difference**: For this particular random sequence, LRU achieved one more cache hit than MRU and completed the sequence 10 cycles faster. LRU retained a block that was later accessed again, while MRU replaced blocks based on most-recent use and did not retain any block long enough to produce a hit.

- **Random Access Behavior**: Both policies still recorded miss rates above 98%, showing that random accesses across a large memory space provide very little opportunity for cache reuse. The small advantage of LRU in this run applies only to this specific random sequence and does not prove that LRU will always outperform MRU for every random input.

---

### Test Case D: Minimum Cache Size (Sequential)
To verify system robustness under extreme constraints, a minimum capacity edge case was tested using the **Sequential** sequence.
- **Configuration**: 4 Cache Blocks (minimum), Block Size of 2 words (minimum), Load-Through.
- **Architecture**: Because the system is 4-Way Set Associative, a 4-block cache results in exactly **1 Set** for the entire cache.

#### Benchmark Results (Minimum Capacity)
| Replacement Policy | Total Accesses | Hits | Misses | Hit Rate | Miss Rate | AMAT (cycles) | Total Access Time |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **LRU** | 16 | 0 | 16 | **0.00%** | **100.00%** | 11.00 | 176.00 |
| **MRU** | 16 | 4 | 12 | **25.00%** | **75.00%** | 8.50 | 136.00 |

#### LRU vs. MRU Simulation Output
![alt text](screenshots/LRU_MRU_MINIMUM.png)

#### Analysis:
Because the cache only holds 4 blocks, but the sequential working set requests 8 blocks ($2n = 8$), the cache capacity is heavily exceeded.
- **LRU** suffers from 100% capacity thrashing. It constantly evicts the oldest block, so by the time the sequence loops back to Block 0, it has already been kicked out.
- **MRU** performs significantly better with a 25% hit rate. Because MRU only evicts the *most recently used* block when full, it accidentally "pins" the first 3 blocks into Ways 0, 1, and 2, and exclusively thrashes Way 3. On the second sequence loop, it successfully hits on those first 3 protected blocks!

---

### Test Case E: Maximum Cache Size (Sequential)
To complete the edge case analysis, the simulator was tested at its absolute maximum configurable limits.
- **Configuration**: 64 Cache Blocks (maximum), Block Size of 16 words (maximum), Load-Through.
- **Architecture**: A 64-block cache utilizing 4-Way Set Associativity results in exactly **16 Sets** ($64 / 4$).

#### Benchmark Results (Maximum Capacity):
| Replacement Policy | Total Accesses | Hits | Misses | Hit Rate | Miss Rate | AMAT (cycles) | Total Access Time |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **LRU** | 256 | 0 | 256 | **0.00%** | **100.00%** | 11.00 | 2,816.00 |
| **MRU** | 256 | 64 | 192 | **25.00%** | **75.00%** | 8.50 | 2,176.00 |

#### LRU vs. MRU Simulation Output
![alt text](screenshots/LRU_MRU_MAXIMUM.png)

#### Analysis:
Even though the cache capacity was vastly increased (64 blocks), the sequential working set scales proportionally with the cache size ($2n = 128$ accessed blocks). Because the working set strictly exceeds the cache size by a factor of 2, the exact same thrashing behavior occurs.
- **LRU** still yields a 0% hit rate, as the cyclic access pattern ensures every block is evicted exactly before it is needed again.
- **MRU** perfectly maintains a 25% hit rate. The mathematics behind this are fascinating: out of the 8 blocks that map to each set, MRU preserves the first 3 blocks accessed. Then it thrashes the 4th way for the middle blocks, which actually leaves the *last* block accessed safely residing in the cache. On the second loop, it hits on the first 3 blocks AND the last block (4 hits per set). With 16 sets, this yields exactly $4 \times 16 = 64$ hits!

---

### Additional Validation: Non-Load-Through Read Policy

- **Pattern Definition**: Access blocks 0 to 31 sequentially and repeat the sequence twice.
- **Total Accesses**: 64 memory block accesses.

#### Benchmark Results

| Replacement Policy | Read Policy | Total Accesses | Hits | Misses | Hit Rate | Miss Rate | Miss Penalty | AMAT (cycles) | Total Access Time (cycles) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **LRU** | Non-Load-Through | 64 | 0 | 64 | **0.00%** | **100.00%** | 42 cycles | 42.00 | 2,688.00 |
| **MRU** | Non-Load-Through | 64 | 16 | 48 | **25.00%** | **75.00%** | 42 cycles | 31.75 | 2,032.00 |

#### LRU vs. MRU Simulation Output
![alt text](screenshots/LRU_MRU_NONLOAD.png)

#### Analysis

This test validates the simulator’s Non-Load-Through read policy using the Sequential sequence. Under this policy, the CPU must wait for the entire four-word memory block to be loaded into the cache before receiving the requested word.

With a cache access time of 1 cycle, a memory access time of 10 cycles per word, and a block size of 4 words, the miss penalty is:

`Miss Penalty = 1 + (4 × 10) + 1 = 42 cycles`

- **LRU Behavior — 0.00% Hit Rate**: LRU produced 0 hits and 64 misses. Because the 32-block working set exceeds the 16-block cache capacity, earlier blocks are evicted before the sequence returns to them. Since every request is a miss, the AMAT is equal to the full 42-cycle miss penalty, resulting in a total memory access time of 2,688 cycles.

- **MRU Behavior — 25.00% Hit Rate**: MRU produced 16 hits and 48 misses. MRU removes the most recently used block when a set is full, allowing some older blocks to remain in the cache until the second pass. These retained blocks produce 16 hits and reduce the AMAT to 31.75 cycles. The total memory access time is therefore reduced to 2,032 cycles.

- **Read Policy Effect**: The hit and miss counts are the same as those produced by the corresponding Load-Through tests because the read policy does not change cache placement or replacement behavior. It only changes the time required to service a cache miss.

- **Overall Observation**: Non-Load-Through produces significantly higher AMAT and total access time than Load-Through because an entire four-word block must be transferred before the CPU receives the requested data. This demonstrates how the selected read policy affects performance even when the cache hit and miss behavior remains unchanged.

---

### Comparative Summary & Architectural Insights

1. **Cyclic Working Sets & Belady's Anomaly**:
   When the active working set exceeds cache capacity ($2n > n$), **LRU exhibits worst-case performance (0% hit rate)** due to cyclic thrashing. **MRU preserves an upper bound hit rate of $\approx 25\% - 42.5\%$** by protecting early set ways from eviction.

2. **Impact of Read Policy on Performance**:
   - **Load-Through** drastically reduces miss penalty ($11\text{ cycles}$ vs $42\text{ cycles}$ for $B=4$), resulting in up to **$3.8\times$ lower Total Memory Access Time**.
   - As Block Size $B$ increases under **Non-Load-Through**, miss penalty grows linearly ($B \times T_{\text{mem}} + 1$), underscoring the efficiency of Load-Through in modern memory controllers.

---

## Repository Structure

```
CSARCH2-CaseStudy1-Group2/
├── screenshots/               # Application output benchmark screenshots
├── src/
│   ├── assets/                # Goomba and visual UI assets
│   ├── components/            # UI Components (CacheGrid, ControlPanel, TraceLog, StatisticsPanel, PDFReportModal)
│   ├── pages/                 # Simulator Page layout
│   ├── simulator/             # Core Cache Engine & Policies (Cache, CacheSet, CacheBlock, LRU, MRU, Statistics, SequenceGenerator)
│   ├── types/                 # TypeScript type definitions (AccessResult, SimulationResult, etc.)
│   ├── App.tsx                # Main Application root
│   ├── index.css              # Mario 8-bit visual design system & print styles
│   └── main.tsx               # Application entry point
├── index.html                 # HTML entry template
├── package.json               # Project dependencies & scripts
├── tsconfig.json              # TypeScript compiler configuration
├── vite.config.ts             # Vite build configuration
└── README.md                  # Primary project documentation & Machine 7 analysis
```
