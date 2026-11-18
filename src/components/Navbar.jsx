import React from 'react';
import { Cpu, Layers, GitCompare, BookOpen, Sparkles, RefreshCw } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onResetCache, currentPreset, onSelectPreset, presets }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-500 text-white font-bold shadow-md shadow-cyan-500/20">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent font-heading">
                Cache Memory Observer
              </h1>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                v2.0 ALU
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Microarchitecture Visualizer for Direct, Fully & Set-Associative Mapping
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTab('lab')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'lab'
                ? 'bg-white text-cyan-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-600" />
            Observer Engine
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'comparison'
                ? 'bg-white text-purple-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <GitCompare className="w-4 h-4 text-purple-600" />
            Mapping Comparison
          </button>

          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'lessons'
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Interactive Guide
          </button>
        </nav>

        {/* Preset Loader & Reset */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={currentPreset || ''}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm cursor-pointer"
            >
              <option value="" disabled>⚡ Load Preset Workload...</option>
              {presets.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <button
            onClick={onResetCache}
            title="Reset Cache State & History"
            className="p-2 rounded-lg bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-300 hover:border-rose-300 shadow-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
