/**
 * Cache Simulation Engine
 * Manages full microarchitectural state for Direct, Fully Associative,
 * and Set-Associative mapping schemes.
 */

import { calculateCacheGeometry, decomposeAddress } from './addressDecomposer';

export function createInitialCacheState(geometry, replacementPolicy = 'LRU', writePolicy = 'write-back') {
  const { numSets, associativity, blockSizeBytes } = geometry;

  const sets = [];
  let globalLineId = 0;

  for (let s = 0; s < numSets; s++) {
    const lines = [];
    for (let l = 0; l < associativity; l++) {
      lines.push({
        id: globalLineId++,
        setIndex: s,
        lineIndex: l,
        valid: false,
        dirty: false,
        tag: null,
        tagHex: '---',
        blockNumber: null,
        data: Array.from({ length: Math.min(8, blockSizeBytes) }, (_, i) => `00`),
        lruCounter: 0,     // Timestamp for LRU
        fifoCounter: 0,    // Insert timestamp for FIFO
        accessFrequency: 0 // Counter for LFU
      });
    }
    sets.push({
      setIndex: s,
      lines
    });
  }

  return {
    geometry,
    replacementPolicy,
    writePolicy,
    sets,
    globalClock: 0,
    stats: {
      totalAccesses: 0,
      reads: 0,
      writes: 0,
      hits: 0,
      misses: 0,
      compulsoryMisses: 0,
      conflictMisses: 0,
      capacityMisses: 0,
      hitRate: 0,
      missRate: 0,
      amat: 0, // Average Memory Access Time
      accessedBlocksSet: new Set()
    },
    history: []
  };
}

export function executeMemoryAccess(currentState, addressInput, isWrite = false, hitTimeNs = 1, missPenaltyNs = 50) {
  const { geometry, replacementPolicy, writePolicy, sets } = currentState;
  const globalClock = currentState.globalClock + 1;
  const decom = decomposeAddress(addressInput, geometry);

  const { indexVal, tagVal, blockNumber } = decom;
  const targetSetIndex = geometry.mappingType === 'fully' ? 0 : indexVal;
  const targetSet = sets[targetSetIndex];

  let isHit = false;
  let hitLineIndex = -1;

  // Search for matching valid tag within target set
  for (let l = 0; l < targetSet.lines.length; l++) {
    const line = targetSet.lines[l];
    if (line.valid && line.tag === tagVal) {
      isHit = true;
      hitLineIndex = l;
      break;
    }
  }

  // Clone sets for state update
  const newSets = sets.map((s, sIdx) => {
    if (sIdx !== targetSetIndex) return s;
    return {
      ...s,
      lines: s.lines.map(l => ({ ...l }))
    };
  });

  const targetLineSet = newSets[targetSetIndex].lines;
  let evictedBlock = null;
  let allocatedLineIndex = -1;
  let missType = null;

  const accessedBlocksSet = new Set(currentState.stats.accessedBlocksSet);
  const isFirstAccessToBlock = !accessedBlocksSet.has(blockNumber);
  accessedBlocksSet.add(blockNumber);

  if (isHit) {
    allocatedLineIndex = hitLineIndex;
    const line = targetLineSet[hitLineIndex];
    line.lruCounter = globalClock;
    line.accessFrequency += 1;
    if (isWrite) {
      if (writePolicy === 'write-back') {
        line.dirty = true;
      }
    }
  } else {
    // Cache Miss
    // Classify miss type
    if (isFirstAccessToBlock) {
      missType = 'compulsory';
    } else {
      // Check total cache capacity
      const totalValidLines = sets.reduce((acc, s) => acc + s.lines.filter(l => l.valid).length, 0);
      if (totalValidLines >= geometry.numLines) {
        missType = 'capacity';
      } else {
        missType = 'conflict';
      }
    }

    // Find line to allocate or replace
    let emptyLineIdx = targetLineSet.findIndex(l => !l.valid);

    if (emptyLineIdx !== -1) {
      allocatedLineIndex = emptyLineIdx;
    } else {
      // Set is full - apply replacement policy
      if (replacementPolicy === 'FIFO') {
        let minFifo = Infinity;
        targetLineSet.forEach((l, idx) => {
          if (l.fifoCounter < minFifo) {
            minFifo = l.fifoCounter;
            allocatedLineIndex = idx;
          }
        });
      } else if (replacementPolicy === 'LFU') {
        let minFreq = Infinity;
        targetLineSet.forEach((l, idx) => {
          if (l.accessFrequency < minFreq) {
            minFreq = l.accessFrequency;
            allocatedLineIndex = idx;
          }
        });
      } else if (replacementPolicy === 'Random') {
        allocatedLineIndex = Math.floor(Math.random() * targetLineSet.length);
      } else {
        // Default LRU
        let minLru = Infinity;
        targetLineSet.forEach((l, idx) => {
          if (l.lruCounter < minLru) {
            minLru = l.lruCounter;
            allocatedLineIndex = idx;
          }
        });
      }
    }

    const lineToUpdate = targetLineSet[allocatedLineIndex];
    if (lineToUpdate.valid) {
      evictedBlock = {
        blockNumber: lineToUpdate.blockNumber,
        tagHex: lineToUpdate.tagHex,
        dirty: lineToUpdate.dirty
      };
    }

    // Populate line
    lineToUpdate.valid = true;
    lineToUpdate.tag = tagVal;
    lineToUpdate.tagHex = decom.tagHex;
    lineToUpdate.blockNumber = blockNumber;
    lineToUpdate.dirty = isWrite && writePolicy === 'write-back';
    lineToUpdate.lruCounter = globalClock;
    lineToUpdate.fifoCounter = globalClock;
    lineToUpdate.accessFrequency = 1;

    // Simulated byte data preview
    lineToUpdate.data = Array.from({ length: Math.min(8, geometry.blockSizeBytes) }, (_, i) => {
      const byteVal = (blockNumber * geometry.blockSizeBytes + i) % 256;
      return byteVal.toString(16).toUpperCase().padStart(2, '0');
    });
  }

  // Update statistics
  const reads = currentState.stats.reads + (isWrite ? 0 : 1);
  const writes = currentState.stats.writes + (isWrite ? 1 : 0);
  const totalAccesses = currentState.stats.totalAccesses + 1;
  const hits = currentState.stats.hits + (isHit ? 1 : 0);
  const misses = currentState.stats.misses + (isHit ? 0 : 1);

  const compulsoryMisses = currentState.stats.compulsoryMisses + (missType === 'compulsory' ? 1 : 0);
  const conflictMisses = currentState.stats.conflictMisses + (missType === 'conflict' ? 1 : 0);
  const capacityMisses = currentState.stats.capacityMisses + (missType === 'capacity' ? 1 : 0);

  const hitRate = parseFloat(((hits / totalAccesses) * 100).toFixed(1));
  const missRate = parseFloat(((misses / totalAccesses) * 100).toFixed(1));
  const missRatio = misses / totalAccesses;
  const amat = parseFloat((hitTimeNs + missRatio * missPenaltyNs).toFixed(2));

  const accessRecord = {
    step: globalClock,
    addressHex: decom.addressHex,
    addressDec: decom.addressDec,
    binaryStr: decom.binaryStr,
    tagHex: decom.tagHex,
    indexVal: decom.indexVal,
    setIndex: targetSetIndex,
    lineIndex: allocatedLineIndex,
    isWrite,
    isHit,
    missType,
    evictedBlock
  };

  const newHistory = [accessRecord, ...currentState.history].slice(0, 50);

  return {
    ...currentState,
    globalClock,
    sets: newSets,
    stats: {
      totalAccesses,
      reads,
      writes,
      hits,
      misses,
      compulsoryMisses,
      conflictMisses,
      capacityMisses,
      hitRate,
      missRate,
      amat,
      accessedBlocksSet
    },
    lastAccess: accessRecord,
    history: newHistory
  };
}
