import React from 'react';
import { Database, Clock } from 'lucide-react';

export default function CacheVisualizer({ cacheState, lastAccess }) {
  const { geometry, sets, replacementPolicy } = cacheState;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white shadow-sm flex flex-col h-full">
      
      {/* Visualizer Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-cyan-700 font-semibold font-heading text-base">
          <Database className="w-5 h-5 text-cyan-600" />
          Cache Memory Matrix ({geometry.numSets} {geometry.numSets === 1 ? 'Set' : 'Sets'} × {geometry.associativity} {geometry.associativity === 1 ? 'Line' : 'Lines'})
        </div>
        
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            HIT
          </span>
          <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            MISS
          </span>
          <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            EVICTED
          </span>
        </div>
      </div>

      {/* Sets Grid */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[500px]">
        {sets.map((set) => {
          const isTargetSet = lastAccess && lastAccess.setIndex === set.setIndex;

          return (
            <div
              key={set.setIndex}
              className={`rounded-xl border transition-all p-3 ${
                isTargetSet
                  ? 'bg-purple-50/80 border-purple-400 ring-1 ring-purple-300 shadow-sm'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Set Title */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-800 bg-purple-100 border border-purple-300 px-2.5 py-0.5 rounded-md">
                    Set [{set.setIndex}]
                  </span>
                  {isTargetSet && (
                    <span className="text-[10px] text-purple-700 font-mono bg-purple-100 px-2 py-0.5 rounded-full border border-purple-300 font-semibold">
                      ← Target Set Indexed
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  {geometry.associativity}-Way Lines
                </div>
              </div>

              {/* Set Lines Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider">
                      <th className="py-1.5 px-2">Line</th>
                      <th className="py-1.5 px-2 text-center">Valid (V)</th>
                      <th className="py-1.5 px-2 text-center">Dirty (D)</th>
                      <th className="py-1.5 px-2">Tag (Hex)</th>
                      <th className="py-1.5 px-2">Block #</th>
                      <th className="py-1.5 px-2">Data Bytes Preview</th>
                      {geometry.associativity > 1 && (
                        <th className="py-1.5 px-2 text-right">{replacementPolicy} Age</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {set.lines.map((line) => {
                      const isTargetLine = lastAccess && lastAccess.setIndex === set.setIndex && lastAccess.lineIndex === line.lineIndex;
                      const isHitLine = isTargetLine && lastAccess.isHit;
                      const isMissLine = isTargetLine && !lastAccess.isHit;
                      const isEviction = isMissLine && lastAccess.evictedBlock;

                      let statusClass = 'hover:bg-slate-100/80';
                      if (isHitLine) {
                        statusClass = 'bg-emerald-50 border-l-4 border-l-emerald-600 text-emerald-950 anim-hit';
                      } else if (isEviction) {
                        statusClass = 'bg-amber-50 border-l-4 border-l-amber-600 text-amber-950 anim-evict';
                      } else if (isMissLine) {
                        statusClass = 'bg-rose-50 border-l-4 border-l-rose-600 text-rose-950 anim-miss';
                      }

                      return (
                        <tr
                          key={line.lineIndex}
                          className={`border-b border-slate-200/80 transition-colors ${statusClass}`}
                        >
                          <td className="py-2 px-2 text-slate-700 font-bold">
                            Line {line.lineIndex}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {line.valid ? (
                              <span className="inline-flex items-center text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded text-[11px]">
                                1
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-slate-400">
                                0
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {line.dirty ? (
                              <span className="inline-flex items-center text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 text-[11px]">
                                1
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-slate-400">
                                0
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2 font-bold text-sky-800">
                            {line.valid ? line.tagHex : '---'}
                          </td>
                          <td className="py-2 px-2 text-purple-800 font-semibold">
                            {line.valid ? `Block ${line.blockNumber}` : 'Empty'}
                          </td>
                          <td className="py-2 px-2 text-slate-600 text-[11px]">
                            {line.valid ? (
                              <div className="flex gap-1">
                                {line.data.map((b, bIdx) => (
                                  <span key={bIdx} className="bg-white px-1.5 py-0.5 rounded border border-slate-300 text-slate-800 font-bold">
                                    {b}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Unallocated</span>
                            )}
                          </td>
                          {geometry.associativity > 1 && (
                            <td className="py-2 px-2 text-right text-slate-600">
                              {line.valid ? (
                                <span className="flex items-center justify-end gap-1 text-[11px] font-semibold">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  t={line.lruCounter}
                                </span>
                              ) : (
                                '---'
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
