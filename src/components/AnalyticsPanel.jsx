import React from 'react';
import { Activity, Target, Clock, AlertTriangle, History, CheckCircle, XCircle } from 'lucide-react';

export default function AnalyticsPanel({ cacheState }) {
  const { stats, history } = cacheState;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 text-cyan-700 font-semibold font-heading text-sm">
          <Activity className="w-4 h-4 text-cyan-600" />
          Metrics & Performance Analytics
        </div>
        <div className="text-xs font-mono text-slate-500">
          Total Accesses: <strong className="text-cyan-700 font-bold">{stats.totalAccesses}</strong>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Hit Rate Card */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-emerald-800 font-bold mb-1">
            <span>Hit Rate</span>
            <Target className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-700">
            {stats.hitRate}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            {stats.hits} Hits / {stats.totalAccesses} Accesses
          </div>
        </div>

        {/* Miss Rate Card */}
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-rose-800 font-bold mb-1">
            <span>Miss Rate</span>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-rose-700">
            {stats.missRate}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            {stats.misses} Misses
          </div>
        </div>

        {/* AMAT (Average Memory Access Time) */}
        <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-purple-800 font-bold mb-1">
            <span>AMAT Latency</span>
            <Clock className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-purple-700">
            {stats.amat} <span className="text-xs">ns</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            Hit: 1ns | Miss Pen: 50ns
          </div>
        </div>

        {/* Reads vs Writes */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl shadow-xs">
          <div className="text-[11px] text-slate-600 font-bold mb-1">
            Ops Breakdown
          </div>
          <div className="flex items-center justify-between text-xs font-mono font-bold mt-2">
            <span className="text-blue-700">Reads: {stats.reads}</span>
            <span className="text-amber-700">Writes: {stats.writes}</span>
          </div>
        </div>

      </div>

      {/* Miss Categorization (3 C's) */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Miss Classification (3 C's Model)
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="text-cyan-700 font-bold text-sm">{stats.compulsoryMisses}</div>
            <div className="text-[10px] text-slate-600 font-bold mt-0.5">Compulsory</div>
            <div className="text-[9px] text-slate-400">First time access</div>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="text-purple-700 font-bold text-sm">{stats.conflictMisses}</div>
            <div className="text-[10px] text-slate-600 font-bold mt-0.5">Conflict</div>
            <div className="text-[9px] text-slate-400">Set mapping limit</div>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="text-rose-700 font-bold text-sm">{stats.capacityMisses}</div>
            <div className="text-[10px] text-slate-600 font-bold mt-0.5">Capacity</div>
            <div className="text-[9px] text-slate-400">Cache full capacity</div>
          </div>
        </div>
      </div>

      {/* Access History Log Table */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-cyan-600" />
            Recent Access Stream History
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Showing last {history.length} operations
          </span>
        </div>

        <div className="overflow-y-auto max-h-44 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs font-mono">
              No memory accesses logged yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase">
                  <th className="py-1 px-2">#</th>
                  <th className="py-1 px-2">Addr</th>
                  <th className="py-1 px-2">Op</th>
                  <th className="py-1 px-2">Set</th>
                  <th className="py-1 px-2">Status</th>
                  <th className="py-1 px-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-200/60 hover:bg-white transition-colors">
                    <td className="py-1.5 px-2 text-slate-500">{item.step}</td>
                    <td className="py-1.5 px-2 font-bold text-sky-800">{item.addressHex}</td>
                    <td className="py-1.5 px-2">
                      <span className={item.isWrite ? 'text-amber-700 font-bold' : 'text-blue-700 font-bold'}>
                        {item.isWrite ? 'WR' : 'RD'}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-purple-700 font-semibold">Set [{item.setIndex}]</td>
                    <td className="py-1.5 px-2 font-bold">
                      {item.isHit ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> HIT
                        </span>
                      ) : (
                        <span className="text-rose-700 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> MISS
                        </span>
                      )}
                    </td>
                    <td className="py-1.5 px-2 text-[10px] text-slate-600">
                      {item.isHit
                        ? `Tag ${item.tagHex}`
                        : `${item.missType?.toUpperCase()} ${
                            item.evictedBlock ? `(Evicted ${item.evictedBlock.tagHex})` : ''
                          }`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
