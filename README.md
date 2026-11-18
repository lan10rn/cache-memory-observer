# Cache Memory Observer

> **Interactive Microarchitecture Cache Simulator & Memory Mapping Visualizer**  
> An educational, real-time visual tool to explore CPU cache architectures, address bit decomposition, cache placement schemes, replacement algorithms, and memory access datapath flow.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Oxlint](https://img.shields.io/badge/Linted_with-Oxlint-orange)](https://oxc.rs/)

---

## 📌 Overview

**Cache Memory Observer** is designed for computer science students, computer systems engineers, and educators to gain an intuitive, deep microarchitectural understanding of modern memory hierarchies.

Modern CPUs bridge the enormous speed gap between processors and main memory through multi-level caches. Understanding how addresses map into cache sets, how conflicts arise, and how replacement policies evict data is crucial for writing cache-friendly software and designing hardware. This tool simulates complete cache mechanics in real time with interactive controls, animated datapath flows, and performance analytics.

---

## ✨ Key Features

### 1. Flexible Cache Geometry Configuration
- **Mapping Schemes**:
  - **Direct Mapped**: Each memory block maps to exactly one predetermined line ($1 \text{ Line per Set}$).
  - **$K$-Way Set-Associative**: Cache lines are organized into $S$ sets, each containing $K$ lines ($2\text{-Way}$, $4\text{-Way}$, $8\text{-Way}$).
  - **Fully Associative**: A memory block can reside in any cache line ($1 \text{ Set}$, $N \text{ Lines}$).
- **Customizable Dimensions**:
  - Main Memory Size: $1024 \text{ B}$ (configurable bounds)
  - Cache Capacity: $64 \text{ B}$ to $1024 \text{ B}$ ($1 \text{ KB}$)
  - Block / Line Size: $4 \text{ B}$, $8 \text{ B}$, $16 \text{ B}$, $32 \text{ B}$
- **Replacement Policies**:
  - **LRU (Least Recently Used)**: Tracks temporal order with access timestamps.
  - **FIFO (First-In, First-Out)**: Evicts the line that entered first.
  - **LFU (Least Frequently Used)**: Evicts the least frequently accessed block.
  - **Random**: Pseudo-random eviction.
- **Write Policy**:
  - **Write-Back** with dirty bit ($D$) tracking and memory eviction logging.

### 2. Real-Time Address Bit Splitter & Decoder
- Decodes incoming memory addresses specified in **Hexadecimal** (`0x1C`), **Decimal** (`28`), or **Binary** (`0b00011100`).
- Displays an interactive, proportionally scaled bit-width bar highlighting:
  - **Tag Field**: Identifies which block is currently placed.
  - **Index Field**: Routes the address to its designated cache set.
  - **Offset Field**: Locates the specific byte within the cache block.
- Calculates and renders live bit math:
  $$\text{Total Address Bits} = \text{Tag Bits} + \text{Index Bits} + \text{Offset Bits}$$

### 3. Interactive Memory-to-Cache Mapping Graph
- SVG-rendered bipartite diagram displaying connections between **Main Memory Blocks** (left) and **Cache Sets/Lines** (right).
- Dynamic cubic Bézier connection curves color-coded per cache set.
- Hover over any memory block to spotlight its target set and lines.
- Filter and inspect individual lines, active blocks, and formula mappings.

### 4. Microarchitecture Datapath Flow
- Step-by-step visual animation through three critical pipeline stages:
  1. **CPU Core**: Dispatches `READ` or `WRITE` instruction at the target address.
  2. **Set Decoder**: Extracts Index bits and selects the target set line(s).
  3. **Tag Comparator & Evaluator**: Compares incoming tag against valid line tags in parallel, resolving to a **HIT** or **MISS**.

### 5. Cache Matrix Inspector
- Detailed matrix view of all cache sets and lines.
- Live inspection of hardware flags:
  - **Valid Bit ($V$)**: Whether the line holds active data.
  - **Dirty Bit ($D$)**: Flags modified data awaiting write-back.
  - **Tag (Hex)**: Stored tag value.
  - **Block Number**: Mapped main memory block ID.
  - **Data Bytes**: Simulated byte content preview.
  - **Age / Frequency Metric**: Counter tracking replacement policy state.
- Distinct color-coded visual animations for **HIT** (green), **MISS** (rose), and **EVICTION** (amber).

### 6. Workload Generator & Benchmarks
- **Manual Step Execution**: Test single addresses with Read or Write operations.
- **Custom Stream Runner**: Execute comma-separated address traces (e.g., `0, 4, 8, 12, 16, 20, 0, 4, 8`).
- **Interactive Preset Workloads**:
  - **Sequential Scan**: Demonstrates spatial locality and high hit rates after compulsory misses.
  - **Temporal Locality Loop**: Simulates tight inner loops with high reuse.
  - **Conflict Thrashing**: Recreates ping-pong evictions in Direct Mapping caused by identical index mappings.
  - **Matrix Stride (Row vs. Column Major)**: Demonstrates performance differences between stride-1 and large-stride traversals.
  - **Random Access Stream**: Evaluates cache resilience under irregular memory patterns.
- **Playback Controls**: Play, pause, adjust simulation speed ($100 \text{ ms}$ to $2000 \text{ ms}$ per cycle), and reset cache state.

### 7. Performance Analytics & 3 C's Miss Model
- **Real-Time Metrics**:
  - **Hit Rate (%)** & **Miss Rate (%)**
  - **Average Memory Access Time (AMAT)**:
    $$\text{AMAT} = \text{Hit Time} + (\text{Miss Rate} \times \text{Miss Penalty})$$
    *(Default parameters: Hit Time = $1 \text{ ns}$, Miss Penalty = $50 \text{ ns}$)*
  - Operation breakdown (Read vs. Write counts).
- **The 3 C's Miss Model Categorization**:
  - **Compulsory (Cold) Miss**: First-time reference to a memory block.
  - **Conflict Miss**: Occurs when multiple blocks map to the same set before cache is full.
  - **Capacity Miss**: Occurs when working set exceeds total cache size.
- **Chronological Access History**: Scrollable log of the last 50 memory operations with step ID, address, hit/miss status, and eviction records.

### 8. Side-by-Side Mapping Comparison Lab
- Run identical memory access benchmarks simultaneously across three configurations:
  1. **Direct Mapping** ($K = 1$)
  2. **2-Way Set-Associative** ($K = 2$)
  3. **Fully Associative** ($K = N$)
- Compare hit rates, AMAT latency, and miss breakdowns side by side to evaluate architectural trade-offs.

### 9. Interactive Education Lab & Quiz
- Conceptual micro-lessons on Direct, Fully Associative, and Set-Associative architectures.
- Trade-off tables covering hardware complexity, comparator count, and access speed.
- Built-in interactive quiz with immediate answer feedback, architectural explanations, and celebration effects on completion.

---

## 🧮 Theoretical Background

### Cache Address Decomposition
Given a byte-addressable main memory of size $M$ bytes and a cache of size $C$ bytes with block size $B$ bytes:

| Field | Formula | Description |
| :--- | :--- | :--- |
| **Total Address Bits ($m$)** | $\lceil \log_2(M) \rceil$ | Total bits required to address main memory |
| **Offset Bits ($b$)** | $\lceil \log_2(B) \rceil$ | Bits required to index a specific byte in a block |
| **Total Lines ($N$)** | $C / B$ | Number of lines in the cache |
| **Number of Sets ($S$)** | $N / K$ | Number of sets (where $K$ is associativity) |
| **Index Bits ($s$)** | $\lceil \log_2(S) \rceil$ | Bits required to select the target set |
| **Tag Bits ($t$)** | $m - (s + b)$ | Bits compared against cache line tags |

### Mapping Formulas

- **Direct Mapping** ($K = 1, S = N$):
  $$\text{Cache Line} = \text{Block Number} \pmod N$$
- **Set-Associative Mapping** ($K$-Way):
  $$\text{Cache Set} = \text{Block Number} \pmod S$$
- **Fully Associative Mapping** ($S = 1, K = N$):
  $$\text{Index Bits} = 0 \quad (\text{Block can reside in any line})$$

### The 3 C's of Cache Misses

1. **Compulsory (Cold) Misses**: Unavoidable misses occurring on the very first reference to a block. Increasing block size can reduce compulsory misses through spatial prefetching.
2. **Conflict Misses**: Occur when multiple memory blocks map to the same set and evict each other, even when free lines exist elsewhere in the cache. Increased associativity mitigates conflict misses.
3. **Capacity Misses**: Occur when the program's working set exceeds the aggregate capacity of the cache. Enlarging total cache size is required to eliminate capacity misses.

---

## 🏗️ Architecture & Project Structure

```
cache-memory-observer/
├── index.html                  # HTML entry point with microarchitecture typography
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite configuration with React and Tailwind plugins
├── src/
│   ├── main.jsx                # Application bootstrap
│   ├── App.jsx                 # Top-level state orchestration & tab router
│   ├── index.css               # Tailwind CSS v4 directives & custom themes
│   ├── App.css                 # Custom animations (pulse, hit, miss, eviction)
│   ├── components/
│   │   ├── Navbar.jsx              # Brand header, tab navigation, preset selector
│   │   ├── ConfigPanel.jsx         # Cache sizing, mapping scheme & policy selectors
│   │   ├── AddressDecomposer.jsx   # Visual bit-slicer (Tag, Index, Offset)
│   │   ├── MemoryMappingGraph.jsx  # SVG Bézier memory-to-cache interactive graph
│   │   ├── PipelineAnimation.jsx   # CPU -> Decoder -> Comparator hardware datapath
│   │   ├── CacheVisualizer.jsx     # Matrix view of sets, lines, tags, valid/dirty bits
│   │   ├── WorkloadControl.jsx     # Single step, custom streams & playback controls
│   │   ├── AnalyticsPanel.jsx      # KPI cards, AMAT, 3 C's miss breakdown, history
│   │   ├── ComparisonView.jsx      # Concurrently compares Direct vs Set vs Fully
│   │   └── EducationLab.jsx        # Theory micro-lessons & interactive quiz
│   └── utils/
│       ├── addressDecomposer.js    # Bit width calculations and bit-string slicing
│       ├── cacheEngine.js          # Core simulation engine, replacement policies & state
│       └── presetWorkloads.js      # Memory trace generators (spatial, temporal, stride)
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or later recommended)
- `npm` or any modern package manager (`pnpm`, `yarn`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/abhinav/cache-memory-observer.git
   cd cache-memory-observer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

### Production Build

To generate an optimized, tree-shaken production build:
```bash
npm run build
```
The output will be placed in the `dist/` directory. You can preview it with:
```bash
npm run preview
```

### Linting

Run Oxlint to check code quality:
```bash
npm run lint
```

---

## 🧪 Experiments to Try

### Experiment 1: Conflict Thrashing in Direct Mapping
1. In the **Observer Engine**, configure **Direct Mapping** with Cache Size = $256 \text{ B}$ and Block Size = $16 \text{ B}$ ($16 \text{ Lines}$).
2. Load the preset **"Conflict Thrashing (Direct Mapping Weakness)"**.
3. Observe how addresses that differ by multiples of the cache size map to the exact same line index, continually evicting each other resulting in a **0% hit rate**.
4. Switch to the **Mapping Comparison** tab and re-run the benchmark to observe how **2-Way Set-Associative** and **Fully Associative** caches eliminate these conflict misses.

### Experiment 2: Spatial Locality with Sequential Scan
1. Select **Sequential Scan (High Spatial Locality)**.
2. Notice the initial **Compulsory Miss** on the first byte of a block, followed by successive **Hits** for subsequent addresses within the same block boundary.
3. Experiment with increasing the Block Size to $32 \text{ B}$ and observe the hit rate increase due to wider spatial coverage.

### Experiment 3: Temporal Locality Loop
1. Run the **Temporal Locality Loop** preset.
2. Watch the first iteration incur compulsory misses as blocks are loaded into cache.
3. Observe all subsequent iterations achieve **100% Hit Rate** as the working set remains warm in cache.

### Experiment 4: Matrix Stride (Row vs. Column Major)
1. Load the **Matrix Stride (Row vs Column Major)** preset.
2. Observe how non-contiguous strides lead to frequent cache line misses compared to sequential stride-1 access patterns, simulating real-world high-performance computing cache stalls.

---

## 🛠️ Tech Stack

- **UI Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).  
Copyright © 2026 Abhinav Chaudhary.
