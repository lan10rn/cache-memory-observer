import React from 'react';
import { Settings2, Cpu, Grid, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function ConfigPanel({ config, setConfig, geometry }) {

  const handleMappingChange = (type) => {
    setConfig(prev => ({
      ...prev,
      mappingType: type
    }));
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-cyan-700 font-semibold font-heading text-base">
          <Settings2 className="w-5 h-5 text-cyan-600" />
          Cache Architecture & Geometry
        </div>
        <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          Lines: <span className="text-cyan-700 font-bold">{geometry.numLines}</span> | Sets: <span className="text-purple-700 font-bold">{geometry.numSets}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Mapping Scheme Selector */}
        <div className="col-span-1 md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-600" />
            1. Mapping Technique
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleMappingChange('direct')}
              className={`p-2.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all border ${
                config.mappingType === 'direct'
                  ? 'bg-cyan-50 text-cyan-800 border-cyan-500 shadow-sm ring-1 ring-cyan-400'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <span className="text-sm font-bold">Direct</span>
              <span className="text-[10px] text-slate-500 font-normal">1 Line per Set</span>
            </button>

            <button
              onClick={() => handleMappingChange('fully')}
              className={`p-2.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all border ${
                config.mappingType === 'fully'
                  ? 'bg-purple-50 text-purple-800 border-purple-500 shadow-sm ring-1 ring-purple-400'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <span className="text-sm font-bold">Fully Associative</span>
              <span className="text-[10px] text-slate-500 font-normal">1 Set, Any Line</span>
            </button>

            <button
              onClick={() => handleMappingChange('set')}
              className={`p-2.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all border ${
                config.mappingType === 'set'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-500 shadow-sm ring-1 ring-emerald-400'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <span className="text-sm font-bold">Set-Associative</span>
              <span className="text-[10px] text-slate-500 font-normal">{config.associativity}-Way Sets</span>
            </button>
          </div>
        </div>

        {/* Set Associativity (if set-associative) */}
        {config.mappingType === 'set' && (
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-emerald-600" />
              Associativity ($K$-way)
            </label>
            <select
              value={config.associativity}
              onChange={(e) => setConfig(p => ({ ...p, associativity: parseInt(e.target.value) }))}
              className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-medium shadow-sm"
            >
              <option value={2}>2-Way Set Associative</option>
              <option value={4}>4-Way Set Associative</option>
              <option value={8}>8-Way Set Associative</option>
            </select>
          </div>
        )}

        {/* Cache Capacity */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-600" />
            Cache Capacity
          </label>
          <select
            value={config.cacheSizeBytes}
            onChange={(e) => setConfig(p => ({ ...p, cacheSizeBytes: parseInt(e.target.value) }))}
            className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-medium shadow-sm"
          >
            <option value={64}>64 Bytes</option>
            <option value={128}>128 Bytes</option>
            <option value={256}>256 Bytes</option>
            <option value={512}>512 Bytes</option>
            <option value={1024}>1024 Bytes (1KB)</option>
          </select>
        </div>

        {/* Block Size */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            Block / Line Size
          </label>
          <select
            value={config.blockSizeBytes}
            onChange={(e) => setConfig(p => ({ ...p, blockSizeBytes: parseInt(e.target.value) }))}
            className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-medium shadow-sm"
          >
            <option value={4}>4 Bytes</option>
            <option value={8}>8 Bytes</option>
            <option value={16}>16 Bytes</option>
            <option value={32}>32 Bytes</option>
          </select>
        </div>

        {/* Replacement Policy */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Replacement Algorithm
          </label>
          <select
            value={config.replacementPolicy}
            onChange={(e) => setConfig(p => ({ ...p, replacementPolicy: e.target.value }))}
            disabled={config.mappingType === 'direct'}
            className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <option value="LRU">LRU (Least Recently Used)</option>
            <option value="FIFO">FIFO (First In First Out)</option>
            <option value="Random">Random Replacement</option>
            <option value="LFU">LFU (Least Frequently Used)</option>
          </select>
        </div>

      </div>
    </div>
  );
}
