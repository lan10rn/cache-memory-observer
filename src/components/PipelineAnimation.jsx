import React from 'react';
import { ArrowRight, Cpu, CheckCircle, AlertOctagon } from 'lucide-react';

export default function PipelineAnimation({ lastAccess, geometry }) {
  if (!lastAccess) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-500 text-xs font-mono h-24">
        Ready for Memory Access... Execute a Read/Write command or run a Workload Preset to observe microarchitectural pipeline.
      </div>
    );
  }

  const { isHit, isWrite, addressHex, tagHex, setIndex, missType, evictedBlock } = lastAccess;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-cyan-700 font-semibold font-heading text-sm">
          <Cpu className="w-4 h-4 text-cyan-600" />
          Hardware Microarchitecture Datapath Flow
        </div>
        <div className="text-xs font-mono">
          Operation: <strong className={isWrite ? 'text-amber-700' : 'text-blue-700'}>{isWrite ? 'WRITE' : 'READ'} {addressHex}</strong>
        </div>
      </div>

      {/* Datapath Nodes Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-xs font-mono">
        
        {/* Node 1: CPU Request */}
        <div className="bg-slate-50 border border-slate-300 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-xs relative">
          <Cpu className="w-5 h-5 text-cyan-600 mb-1" />
          <div className="font-bold text-slate-800">1. CPU Core</div>
          <div className="text-[10px] text-slate-500">Requesting {addressHex}</div>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex justify-center text-slate-400">
          <ArrowRight className="w-5 h-5 animate-pulse text-cyan-600" />
        </div>

        {/* Node 2: Decoder & Set Index */}
        <div className="bg-purple-50 border border-purple-300 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-xs">
          <div className="font-bold text-purple-900">2. Set Decoder</div>
          <div className="text-[10px] text-purple-700 font-semibold">Target Set [{setIndex}]</div>
          <div className="text-[9px] text-slate-500 mt-1">Tag = {tagHex}</div>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex justify-center text-slate-400">
          <ArrowRight className="w-5 h-5 animate-pulse text-purple-600" />
        </div>

        {/* Node 3: Tag Match / Result */}
        <div className={`border p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-xs ${
          isHit 
            ? 'bg-emerald-50 border-emerald-400 text-emerald-900' 
            : 'bg-rose-50 border-rose-400 text-rose-900'
        }`}>
          {isHit ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-600 mb-1 animate-bounce" />
              <div className="font-bold text-emerald-800">CACHE HIT!</div>
              <div className="text-[10px] text-emerald-700 font-semibold">Tag Matched in Set {setIndex}</div>
            </>
          ) : (
            <>
              <AlertOctagon className="w-5 h-5 text-rose-600 mb-1 animate-pulse" />
              <div className="font-bold text-rose-800">CACHE MISS ({missType?.toUpperCase()})</div>
              <div className="text-[10px] text-rose-700 font-semibold">
                {evictedBlock ? `Evicted Block ${evictedBlock.blockNumber}` : 'Fetching from Main Memory'}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
