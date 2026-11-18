import React, { useState } from 'react';
import { Play, SkipForward, Zap, Sliders, ArrowUpRight, Flame } from 'lucide-react';

export default function WorkloadControl({
  onSingleAccess,
  onRunStream,
  isPlaying,
  setIsPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  presets,
  onSelectPreset,
  geometry
}) {
  const [addressInput, setAddressInput] = useState('0x00');
  const [isWrite, setIsWrite] = useState(false);
  const [customStreamText, setCustomStreamText] = useState('0, 4, 8, 12, 16, 20, 0, 4, 8');

  const handleStepClick = () => {
    onSingleAccess(addressInput, isWrite);
  };

  const handleRunCustomStream = () => {
    const addresses = customStreamText
      .split(/[,;\s]+/)
      .map(s => s.trim())
      .filter(Boolean)
      .map(str => {
        let val = 0;
        if (str.startsWith('0x') || str.startsWith('0X')) val = parseInt(str, 16);
        else if (str.startsWith('0b') || str.startsWith('0B')) val = parseInt(str.slice(2), 2);
        else val = parseInt(str, 10);
        return { address: isNaN(val) ? 0 : val, isWrite: false };
      });

    if (addresses.length > 0) {
      onRunStream(addresses);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 text-cyan-700 font-semibold font-heading text-sm">
          <Zap className="w-4 h-4 text-cyan-600" />
          Memory Workload & Access Generator
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">Max Addr:</span>
          <span className="text-xs font-mono font-bold text-cyan-700">
            0x{(geometry.mainMemorySizeBytes - 1).toString(16).toUpperCase()} ({geometry.mainMemorySizeBytes - 1})
          </span>
        </div>
      </div>

      {/* 1. Single Address Execution */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Single Address Operation
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="e.g. 0x1C, 28, or 0b00011100"
              className="w-full bg-white border border-slate-300 text-slate-900 font-mono text-sm rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
            />
            <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 font-mono">
              HEX / DEC / BIN
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsWrite(!isWrite)}
              className={`px-3 py-2 rounded-lg text-xs font-bold font-mono transition-colors border shadow-xs ${
                isWrite
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-sky-100 text-sky-900 border-sky-300'
              }`}
            >
              {isWrite ? 'WRITE' : 'READ'}
            </button>

            <button
              onClick={handleStepClick}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold shadow-sm shadow-cyan-600/20 transition-all active:scale-95"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Step Execute
            </button>
          </div>
        </div>
      </div>

      {/* 2. Custom Address Stream Runner */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">
            Custom Address Access Stream
          </span>
          <span className="text-[10px] text-slate-500">Comma / Space separated</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <textarea
            rows={2}
            value={customStreamText}
            onChange={(e) => setCustomStreamText(e.target.value)}
            className="w-full bg-white border border-slate-300 text-slate-900 font-mono text-xs rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none shadow-sm"
            placeholder="0, 4, 8, 12, 16, 20, 0, 4"
          />

          <div className="flex flex-col justify-between gap-1">
            <button
              onClick={handleRunCustomStream}
              className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5" />
              Run Stream
            </button>

            <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded border border-slate-300 text-[10px] text-slate-600 shadow-xs">
              <Sliders className="w-3 h-3 text-slate-400" />
              <span>Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="bg-transparent text-cyan-700 font-mono font-bold focus:outline-none cursor-pointer"
              >
                <option value={1000}>1.0x (1s)</option>
                <option value={500}>2.0x (0.5s)</option>
                <option value={200}>5.0x (0.2s)</option>
                <option value={50}>Fastest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Preset Workload Scenarios */}
      <div>
        <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          Preset Benchmark Workloads
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className="p-3 rounded-xl bg-white hover:bg-slate-50 text-left border border-slate-200 hover:border-slate-300 shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-cyan-700">
                  {preset.name}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 transition-colors" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
