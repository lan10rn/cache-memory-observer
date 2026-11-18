import React, { useState, useEffect } from 'react';
import { GitCompare } from 'lucide-react';
import { calculateCacheGeometry } from '../utils/addressDecomposer';
import { createInitialCacheState, executeMemoryAccess } from '../utils/cacheEngine';

export default function ComparisonView({ presets }) {
  const baseConfig = {
    mainMemorySizeBytes: 1024,
    cacheSizeBytes: 256,
    blockSizeBytes: 16,
    replacementPolicy: 'LRU'
  };

  const [simulations, setSimulations] = useState(() => {
    const directGeom = calculateCacheGeometry({ ...baseConfig, mappingType: 'direct' });
    const setGeom = calculateCacheGeometry({ ...baseConfig, mappingType: 'set', associativity: 2 });
    const fullyGeom = calculateCacheGeometry({ ...baseConfig, mappingType: 'fully' });

    return {
      direct: createInitialCacheState(directGeom),
      setAssoc: createInitialCacheState(setGeom),
      fully: createInitialCacheState(fullyGeom)
    };
  });

  const [currentWorkloadName, setCurrentWorkloadName] = useState('Conflict Thrashing');

  const runComparisonPreset = (presetId) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    setCurrentWorkloadName(preset.name);

    const directGeom = calculateCacheGeometry({ ...baseConfig, mappingType: 'direct' });
    const setGeom = calculateCacheGeometry({ ...baseConfig, mappingType: 'set', associativity: 2 });
    const fullyGeom = calculateCacheGeometry({ ...baseConfig, mappingType: 'fully' });

    let sDirect = createInitialCacheState(directGeom);
    let sSet = createInitialCacheState(setGeom);
    let sFully = createInitialCacheState(fullyGeom);

    const addresses = preset.generate(directGeom);

    addresses.forEach(item => {
      sDirect = executeMemoryAccess(sDirect, item.address, item.isWrite);
      sSet = executeMemoryAccess(sSet, item.address, item.isWrite);
      sFully = executeMemoryAccess(sFully, item.address, item.isWrite);
    });

    setSimulations({
      direct: sDirect,
      setAssoc: sSet,
      fully: sFully
    });
  };

  useEffect(() => {
    runComparisonPreset('thrashing');
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-200 bg-gradient-to-r from-purple-50 via-white to-slate-50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-900 font-bold font-heading text-lg mb-1">
            <GitCompare className="w-6 h-6 text-purple-600" />
            Side-by-Side Cache Mapping Comparison Lab
          </div>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Simulate identical memory address streams concurrently across Direct, 2-Way Set-Associative, and Fully Associative mapping schemes to observe performance trade-offs in real-time.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-600 font-bold">Run Benchmark:</span>
          <select
            onChange={(e) => runComparisonPreset(e.target.value)}
            className="bg-white border border-purple-300 text-purple-900 text-xs font-bold font-mono rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm cursor-pointer"
          >
            {presets.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Columns Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Scheme 1: Direct Mapping */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-100">
            <div>
              <h3 className="text-base font-extrabold text-cyan-900 font-heading">
                1. Direct Mapping
              </h3>
              <span className="text-[10px] text-cyan-700 font-mono font-semibold">
                Line = Block % {simulations.direct.geometry.numLines}
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-cyan-50 px-2 py-1 rounded border border-cyan-300 text-cyan-800">
              1-Way
            </span>
          </div>

          <div className="space-y-3">
            {/* Hit Rate Gauge */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-600 font-bold">Hit Rate</span>
                <span className="font-extrabold text-cyan-700">{simulations.direct.stats.hitRate}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  style={{ width: `${simulations.direct.stats.hitRate}%` }}
                  className="h-full bg-gradient-to-r from-cyan-600 to-teal-500 transition-all duration-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[10px]">Hits / Misses</div>
                <div className="font-extrabold text-slate-800">{simulations.direct.stats.hits} / {simulations.direct.stats.misses}</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[10px]">AMAT Latency</div>
                <div className="font-extrabold text-purple-700">{simulations.direct.stats.amat} ns</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Tag Bits:</span>
                <span className="text-cyan-800 font-extrabold">{simulations.direct.geometry.tagBits} bits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Conflict Misses:</span>
                <span className="text-rose-700 font-extrabold">{simulations.direct.stats.conflictMisses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">HW Logic Overhead:</span>
                <span className="text-emerald-700 font-bold">Lowest (Simple)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scheme 2: Set Associative Mapping */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div>
              <h3 className="text-base font-extrabold text-emerald-900 font-heading">
                2. 2-Way Set Associative
              </h3>
              <span className="text-[10px] text-emerald-700 font-mono font-semibold">
                Set = Block % {simulations.setAssoc.geometry.numSets}
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-300 text-emerald-800">
              2-Way
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-600 font-bold">Hit Rate</span>
                <span className="font-extrabold text-emerald-700">{simulations.setAssoc.stats.hitRate}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  style={{ width: `${simulations.setAssoc.stats.hitRate}%` }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[10px]">Hits / Misses</div>
                <div className="font-extrabold text-slate-800">{simulations.setAssoc.stats.hits} / {simulations.setAssoc.stats.misses}</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[10px]">AMAT Latency</div>
                <div className="font-extrabold text-purple-700">{simulations.setAssoc.stats.amat} ns</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Tag Bits:</span>
                <span className="text-emerald-800 font-extrabold">{simulations.setAssoc.geometry.tagBits} bits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Conflict Misses:</span>
                <span className="text-rose-700 font-extrabold">{simulations.setAssoc.stats.conflictMisses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">HW Logic Overhead:</span>
                <span className="text-amber-700 font-bold">Balanced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scheme 3: Fully Associative Mapping */}
        <div className="glass-panel rounded-2xl p-5 border border-purple-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100">
            <div>
              <h3 className="text-base font-extrabold text-purple-900 font-heading">
                3. Fully Associative
              </h3>
              <span className="text-[10px] text-purple-700 font-mono font-semibold">
                Block → Any Line
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-purple-50 px-2 py-1 rounded border border-purple-300 text-purple-800">
              Full ({simulations.fully.geometry.numLines}-Way)
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-600 font-bold">Hit Rate</span>
                <span className="font-extrabold text-purple-700">{simulations.fully.stats.hitRate}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  style={{ width: `${simulations.fully.stats.hitRate}%` }}
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[10px]">Hits / Misses</div>
                <div className="font-extrabold text-slate-800">{simulations.fully.stats.hits} / {simulations.fully.stats.misses}</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[10px]">AMAT Latency</div>
                <div className="font-extrabold text-purple-700">{simulations.fully.stats.amat} ns</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Tag Bits:</span>
                <span className="text-purple-800 font-extrabold">{simulations.fully.geometry.tagBits} bits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Conflict Misses:</span>
                <span className="text-rose-700 font-extrabold">{simulations.fully.stats.conflictMisses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">HW Logic Overhead:</span>
                <span className="text-rose-700 font-bold">Highest (CAM Comparators)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
