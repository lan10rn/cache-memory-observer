/**
 * Preset Workloads Generator
 * Generates realistic memory access streams for educational scenarios and benchmark testing.
 */

export const PRESET_WORKLOADS = [
  {
    id: 'sequential',
    name: 'Sequential Scan (High Spatial Locality)',
    description: 'Accesses consecutive memory blocks step by step. Demonstrates block loading efficiency and high hit rates after compulsory misses.',
    category: 'Spatial Locality',
    generate: (geometry) => {
      const addresses = [];
      const max = Math.min(64, geometry.mainMemorySizeBytes);
      const step = Math.max(1, Math.floor(geometry.blockSizeBytes / 2));
      for (let addr = 0; addr < max; addr += step) {
        addresses.push({ address: addr, isWrite: false });
      }
      return addresses;
    }
  },
  {
    id: 'temporal_loop',
    name: 'Temporal Locality Loop',
    description: 'Repeatedly loops over a small working set of addresses (e.g. inner loop body). First pass misses, subsequent passes achieve 100% hits.',
    category: 'Temporal Locality',
    generate: (geometry) => {
      const addresses = [];
      const workingSet = [0, 4, 8, 12, 16];
      for (let iter = 0; iter < 4; iter++) {
        workingSet.forEach(addr => {
          addresses.push({ address: addr % geometry.mainMemorySizeBytes, isWrite: iter % 2 === 1 });
        });
      }
      return addresses;
    }
  },
  {
    id: 'thrashing',
    name: 'Conflict Thrashing (Direct Mapping Weakness)',
    description: 'Accesses addresses that map to the exact same Cache Line/Set index. Causes 0% hit rate in Direct Mapping, but Associative caches absorb it.',
    category: 'Cache Conflicts',
    generate: (geometry) => {
      const addresses = [];
      // Calculate stride equal to Cache Size (so block % numSets is identical)
      const stride = geometry.cacheSizeBytes;
      const baseAddrs = [0, stride, stride * 2];
      
      for (let i = 0; i < 6; i++) {
        baseAddrs.forEach(base => {
          addresses.push({ address: base % geometry.mainMemorySizeBytes, isWrite: false });
        });
      }
      return addresses;
    }
  },
  {
    id: 'row_vs_col',
    name: 'Matrix Stride (Row vs Column Major)',
    description: 'Simulates traversing 2D matrices. Row-major access maximizes spatial locality, while column-major stride causes heavy cache line misses.',
    category: 'Real-world Patterns',
    generate: (geometry) => {
      const addresses = [];
      const rows = 4;
      const cols = 4;
      const elementSize = 4; // 4 bytes per integer
      
      // Column-major stride access: matrix[col][row]
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const addr = (r * cols + c) * elementSize;
          addresses.push({ address: addr % geometry.mainMemorySizeBytes, isWrite: false });
        }
      }
      return addresses;
    }
  },
  {
    id: 'random',
    name: 'Random Access Stream',
    description: 'Uniformly random memory accesses. Tests baseline performance under irregular memory patterns.',
    category: 'Synthetic',
    generate: (geometry) => {
      const addresses = [];
      const count = 24;
      for (let i = 0; i < count; i++) {
        const randAddr = Math.floor(Math.random() * (geometry.mainMemorySizeBytes / 2));
        addresses.push({ address: randAddr, isWrite: Math.random() > 0.7 });
      }
      return addresses;
    }
  }
];
