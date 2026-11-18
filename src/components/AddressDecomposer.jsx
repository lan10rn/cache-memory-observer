import React from 'react';
import { Binary } from 'lucide-react';
import { decomposeAddress } from '../utils/addressDecomposer';

export default function AddressDecomposer({ currentAddress, geometry }) {
  const decom = decomposeAddress(currentAddress, geometry);
  const { tagBits, indexBits, offsetBits, totalAddressBits } = geometry;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-cyan-700 font-semibold font-heading text-base">
          <Binary className="w-5 h-5 text-cyan-600" />
          Address Bit Splitter & Decoder
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          <span>Target: <strong className="text-cyan-700 font-bold">{decom.addressHex}</strong></span>
          <span className="text-slate-300">|</span>
          <span>Block #: <strong className="text-purple-700 font-bold">{decom.blockNumber}</strong></span>
        </div>
      </div>

      {/* Bit Visualizer Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-mono">
          <span>MSB (Bit {totalAddressBits - 1})</span>
          <span>Binary: <strong className="text-slate-800 font-bold">{decom.binaryStr}</strong></span>
          <span>LSB (Bit 0)</span>
        </div>

        {/* Visual Segment Bar */}
        <div className="h-14 w-full rounded-xl overflow-hidden flex shadow-inner border border-slate-300 bg-slate-100 p-1.5 gap-1.5 font-mono text-xs">
          
          {/* Tag Segment */}
          {tagBits > 0 && (
            <div 
              style={{ flexGrow: tagBits }}
              className="bg-sky-100 hover:bg-sky-200/90 text-sky-900 border border-sky-300 rounded-lg flex flex-col items-center justify-center transition-all group relative px-1 shadow-xs"
            >
              <span className="font-extrabold text-xs tracking-widest truncate">{decom.tagBin}</span>
              <span className="text-[9px] text-sky-700 font-mono font-bold uppercase">TAG ({tagBits}b)</span>
            </div>
          )}

          {/* Index Segment */}
          {indexBits > 0 ? (
            <div 
              style={{ flexGrow: indexBits }}
              className="bg-purple-100 hover:bg-purple-200/90 text-purple-900 border border-purple-300 rounded-lg flex flex-col items-center justify-center transition-all group relative px-1 shadow-xs"
            >
              <span className="font-extrabold text-xs tracking-widest truncate">{decom.indexBin}</span>
              <span className="text-[9px] text-purple-700 font-mono font-bold uppercase">INDEX ({indexBits}b)</span>
            </div>
          ) : (
            <div className="bg-slate-200 text-slate-500 border border-slate-300 rounded-lg flex items-center justify-center text-[10px] px-2 font-mono">
              NO INDEX (Fully Assoc)
            </div>
          )}

          {/* Offset Segment */}
          {offsetBits > 0 && (
            <div 
              style={{ flexGrow: offsetBits }}
              className="bg-amber-100 hover:bg-amber-200/90 text-amber-900 border border-amber-300 rounded-lg flex flex-col items-center justify-center transition-all group relative px-1 shadow-xs"
            >
              <span className="font-extrabold text-xs tracking-widest truncate">{decom.offsetBin}</span>
              <span className="text-[9px] text-amber-700 font-mono font-bold uppercase">OFFSET ({offsetBits}b)</span>
            </div>
          )}

        </div>
      </div>

      {/* Bit Width Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        
        <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <div className="font-bold text-sky-900">Tag Value</div>
            <div className="text-[10px] text-slate-500">Identifies block in memory</div>
          </div>
          <div className="text-right font-mono">
            <div className="text-sm font-extrabold text-sky-700">{decom.tagHex}</div>
            <div className="text-[10px] text-slate-500">({decom.tagVal})</div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <div className="font-bold text-purple-900">Target Set Index</div>
            <div className="text-[10px] text-slate-500">Determines cache set line</div>
          </div>
          <div className="text-right font-mono">
            <div className="text-sm font-extrabold text-purple-700">{decom.indexHex}</div>
            <div className="text-[10px] text-slate-500">({decom.indexVal})</div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <div className="font-bold text-amber-900">Byte Offset</div>
            <div className="text-[10px] text-slate-500">Byte within block line</div>
          </div>
          <div className="text-right font-mono">
            <div className="text-sm font-extrabold text-amber-700">Byte {decom.offsetVal}</div>
            <div className="text-[10px] text-slate-500">Offset: {offsetBits} bits</div>
          </div>
        </div>

      </div>
    </div>
  );
}
