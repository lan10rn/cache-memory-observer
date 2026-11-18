import React, { useState, useMemo } from 'react';
import { GitFork, Network, Eye, Layers, Sparkles, AlertCircle } from 'lucide-react';

const SET_COLORS = [
  { stroke: '#0284c7', bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-800', light: '#e0f2fe' },
  { stroke: '#7c3aed', bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-800', light: '#f3e8ff' },
  { stroke: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800', light: '#d1fae5' },
  { stroke: '#d97706', bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800', light: '#fef3c7' },
  { stroke: '#db2777', bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-800', light: '#fce7f3' },
  { stroke: '#4f46e5', bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-800', light: '#e0e7ff' },
  { stroke: '#0d9488', bg: 'bg-teal-50', border: 'border-teal-300', text: 'text-teal-800', light: '#ccfbf1' },
  { stroke: '#ea580c', bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', light: '#ffedd5' },
];

export default function MemoryMappingGraph({ geometry, cacheState, onSelectAddress }) {
  const { numSets, numLines, blockSizeBytes, mainMemorySizeBytes, mappingType, associativity } = geometry;

  const totalMemoryBlocks = Math.max(1, Math.floor(mainMemorySizeBytes / blockSizeBytes));
  const maxDisplayBlocks = Math.min(16, totalMemoryBlocks); // Display first 16 blocks for clear diagram

  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [hoveredSet, setHoveredSet] = useState(null);
  const [showAllLines, setShowAllLines] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);

  // Layout measurements
  const blockHeight = 44;
  const blockGap = 10;
  const setHeight = Math.max(52, associativity * 36 + 24);
  const setGap = 12;

  const leftColumnWidth = 200;
  const rightColumnWidth = 240;
  const graphWidth = 920;
  
  const totalBlocksHeight = maxDisplayBlocks * (blockHeight + blockGap);
  const totalSetsHeight = numSets * (setHeight + setGap);
  const graphHeight = Math.max(totalBlocksHeight, totalSetsHeight, 460) + 60;

  // Compute Memory Blocks positions
  const memoryBlocks = useMemo(() => {
    const list = [];
    const startY = 40;
    for (let b = 0; b < maxDisplayBlocks; b++) {
      const startAddr = b * blockSizeBytes;
      const endAddr = startAddr + blockSizeBytes - 1;
      
      let targetSet = 0;
      let targetLine = 0;

      if (mappingType === 'direct') {
        targetSet = b % numLines;
        targetLine = targetSet;
      } else if (mappingType === 'set') {
        targetSet = b % numSets;
      } else {
        // Fully associative
        targetSet = 0;
      }

      list.push({
        blockNum: b,
        startAddr,
        endAddr,
        startHex: `0x${startAddr.toString(16).toUpperCase()}`,
        endHex: `0x${endAddr.toString(16).toUpperCase()}`,
        targetSet,
        y: startY + b * (blockHeight + blockGap),
        height: blockHeight
      });
    }
    return list;
  }, [maxDisplayBlocks, blockSizeBytes, mappingType, numSets, numLines]);

  // Compute Cache Sets positions
  const cacheSetNodes = useMemo(() => {
    const list = [];
    const startY = 40;
    for (let s = 0; s < numSets; s++) {
      list.push({
        setIndex: s,
        y: startY + s * (setHeight + setGap),
        height: setHeight,
        colorTheme: SET_COLORS[s % SET_COLORS.length]
      });
    }
    return list;
  }, [numSets, setHeight, setGap]);

  // Mapping formula title
  let formulaText = '';
  if (mappingType === 'direct') {
    formulaText = `Line = Block # % ${numLines}`;
  } else if (mappingType === 'set') {
    formulaText = `Set = Block # % ${numSets} (${associativity}-Way)`;
  } else {
    formulaText = 'Any Line (Fully Associative Pool)';
  }

  // Active highlighted edges
  const activeEdges = useMemo(() => {
    return memoryBlocks.filter(b => {
      if (showAllLines) return true;
      if (hoveredBlock !== null && b.blockNum === hoveredBlock) return true;
      if (selectedBlock !== null && b.blockNum === selectedBlock) return true;
      if (hoveredSet !== null && b.targetSet === hoveredSet) return true;
      if (cacheState.lastAccess && Math.floor(cacheState.lastAccess.addressDec / blockSizeBytes) === b.blockNum) return true;
      return false;
    });
  }, [memoryBlocks, showAllLines, hoveredBlock, selectedBlock, hoveredSet, cacheState.lastAccess, blockSizeBytes]);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white shadow-sm space-y-4">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-cyan-800 font-bold font-heading text-base">
            <Network className="w-5 h-5 text-cyan-600" />
            Memory Blocks Mapping Graph (Mermaid Flow Architecture)
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic node-edge diagram illustrating how Main Memory Blocks map to Cache Lines based on your Capacity & Block Size.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAllLines(!showAllLines)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all border shadow-xs ${
              showAllLines
                ? 'bg-cyan-50 text-cyan-800 border-cyan-400'
                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {showAllLines ? 'Hide Mapping Web' : 'Show All Mapping Lines'}
          </button>

          <div className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
            {formulaText}
          </div>
        </div>
      </div>

      {/* Conflict Insight Alert if Direct Mapping */}
      {mappingType === 'direct' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Direct Mapping Conflict Insight:</strong> Notice how Blocks <strong>0, {numLines}, {numLines * 2}</strong> all connect to the exact same <strong>Line 0</strong>. Hover over them to trace conflict collisions!
            </span>
          </div>
        </div>
      )}

      {/* SVG Interactive Architecture Graph */}
      <div className="relative border border-slate-200 rounded-xl bg-slate-50/60 overflow-x-auto shadow-inner">
        <svg
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          className="w-full min-w-[840px] select-none"
          style={{ height: `${graphHeight}px` }}
        >
          <defs>
            {/* Arrow markers for edges */}
            {SET_COLORS.map((col, idx) => (
              <marker
                key={idx}
                id={`arrow-${idx}`}
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill={col.stroke} />
              </marker>
            ))}

            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
            </marker>
          </defs>

          {/* Graph Column Labels */}
          <text x="120" y="24" textAnchor="middle" className="text-xs font-bold fill-slate-700 font-sans uppercase tracking-wider">
            Main Memory ({maxDisplayBlocks} of {totalMemoryBlocks} Blocks)
          </text>
          
          <text x="460" y="24" textAnchor="middle" className="text-xs font-bold fill-purple-700 font-sans uppercase tracking-wider">
            Mapping Logic Dispatcher
          </text>

          <text x="790" y="24" textAnchor="middle" className="text-xs font-bold fill-slate-700 font-sans uppercase tracking-wider">
            CPU Cache ({numSets} {numSets === 1 ? 'Set' : 'Sets'}, {numLines} Lines)
          </text>

          {/* Center Mapping Router Node */}
          <g transform={`translate(370, ${graphHeight / 2 - 45})`}>
            <rect
              width="180"
              height="80"
              rx="12"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="2"
              className="shadow-sm"
            />
            <circle cx="20" cy="24" r="6" fill="#7c3aed" />
            <text x="34" y="28" className="text-[12px] font-bold fill-purple-900 font-heading">
              {mappingType === 'direct' ? 'DIRECT MODULO' : mappingType === 'set' ? 'SET MODULO' : 'CAM FULLY ASSOC'}
            </text>
            <text x="90" y="52" textAnchor="middle" className="text-[11px] font-mono font-bold fill-slate-700">
              {formulaText}
            </text>
            <text x="90" y="68" textAnchor="middle" className="text-[9px] font-mono fill-slate-500">
              Block Size: {blockSizeBytes}B
            </text>
          </g>

          {/* Connecting Curved Edges */}
          {activeEdges.map((block) => {
            const targetSetNode = cacheSetNodes[block.targetSet] || cacheSetNodes[0];
            const colorTheme = SET_COLORS[block.targetSet % SET_COLORS.length];

            const x1 = 220; // right of memory block
            const y1 = block.y + blockHeight / 2;
            const x2 = 680; // left of cache set
            const y2 = targetSetNode.y + targetSetNode.height / 2;

            const isHovered = hoveredBlock === block.blockNum || hoveredSet === block.targetSet;
            const isAccessMatch = cacheState.lastAccess && Math.floor(cacheState.lastAccess.addressDec / blockSizeBytes) === block.blockNum;

            return (
              <path
                key={block.blockNum}
                d={`M ${x1} ${y1} C ${x1 + 140} ${y1}, ${x2 - 140} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={isAccessMatch ? '#0284c7' : colorTheme.stroke}
                strokeWidth={isHovered || isAccessMatch ? 3.5 : 1.8}
                strokeDasharray={isAccessMatch ? '6,3' : 'none'}
                markerEnd={`url(#arrow-${block.targetSet % SET_COLORS.length})`}
                opacity={isHovered || isAccessMatch ? 1 : showAllLines ? 0.35 : 0.8}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Left Column: Memory Block Nodes */}
          {memoryBlocks.map((block) => {
            const isHovered = hoveredBlock === block.blockNum || selectedBlock === block.blockNum;
            const targetSetNode = cacheSetNodes[block.targetSet] || cacheSetNodes[0];
            const colorTheme = SET_COLORS[block.targetSet % SET_COLORS.length];
            const isAccessMatch = cacheState.lastAccess && Math.floor(cacheState.lastAccess.addressDec / blockSizeBytes) === block.blockNum;

            return (
              <g
                key={block.blockNum}
                transform={`translate(30, ${block.y})`}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredBlock(block.blockNum)}
                onMouseLeave={() => setHoveredBlock(null)}
                onClick={() => {
                  setSelectedBlock(block.blockNum);
                  if (onSelectAddress) onSelectAddress(block.startAddr);
                }}
              >
                <rect
                  width={190}
                  height={blockHeight}
                  rx="8"
                  fill={isHovered ? colorTheme.light : isAccessMatch ? '#e0f2fe' : '#ffffff'}
                  stroke={isAccessMatch ? '#0284c7' : isHovered ? colorTheme.stroke : '#e2e8f0'}
                  strokeWidth={isHovered || isAccessMatch ? 2 : 1.2}
                />

                <circle cx="16" cy="22" r="5" fill={colorTheme.stroke} />
                
                <text x="28" y="20" className="text-[12px] font-bold fill-slate-800 font-mono">
                  Block {block.blockNum}
                </text>

                <text x="28" y="34" className="text-[10px] font-mono fill-slate-500">
                  {block.startHex} - {block.endHex}
                </text>

                <rect
                  x="115"
                  y="12"
                  width="65"
                  height="20"
                  rx="5"
                  fill={colorTheme.light}
                  stroke={colorTheme.stroke}
                  strokeWidth="0.8"
                />
                <text x="147" y="26" textAnchor="middle" className={`text-[10px] font-bold font-mono ${colorTheme.text}`}>
                  Set [{block.targetSet}]
                </text>
              </g>
            );
          })}

          {/* Right Column: Cache Set & Line Nodes */}
          {cacheSetNodes.map((setNode) => {
            const isHovered = hoveredSet === setNode.setIndex;
            const colorTheme = setNode.colorTheme;
            const setLines = cacheState.sets[setNode.setIndex]?.lines || [];
            const isTargetSet = cacheState.lastAccess && cacheState.lastAccess.setIndex === setNode.setIndex;

            return (
              <g
                key={setNode.setIndex}
                transform={`translate(680, ${setNode.y})`}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredSet(setNode.setIndex)}
                onMouseLeave={() => setHoveredSet(null)}
              >
                <rect
                  width={210}
                  height={setNode.height}
                  rx="10"
                  fill={isHovered ? colorTheme.light : isTargetSet ? '#f5f3ff' : '#ffffff'}
                  stroke={isTargetSet ? '#7c3aed' : isHovered ? colorTheme.stroke : '#cbd5e1'}
                  strokeWidth={isTargetSet || isHovered ? 2.5 : 1.2}
                />

                {/* Set Title Badge */}
                <rect
                  x="10"
                  y="8"
                  width="70"
                  height="20"
                  rx="4"
                  fill={colorTheme.stroke}
                />
                <text x="45" y="22" textAnchor="middle" className="text-[10px] font-bold fill-white font-mono">
                  Set [{setNode.setIndex}]
                </text>

                <text x="90" y="22" className="text-[10px] font-mono fill-slate-500">
                  {associativity}-Way
                </text>

                {/* Inner Cache Lines */}
                {setLines.map((line, lIdx) => {
                  const lineY = 32 + lIdx * 34;
                  const isHitLine = isTargetSet && cacheState.lastAccess?.lineIndex === lIdx && cacheState.lastAccess?.isHit;
                  const isMissLine = isTargetSet && cacheState.lastAccess?.lineIndex === lIdx && !cacheState.lastAccess?.isHit;

                  return (
                    <g key={lIdx} transform={`translate(10, ${lineY})`}>
                      <rect
                        width={190}
                        height={28}
                        rx="6"
                        fill={isHitLine ? '#d1fae5' : isMissLine ? '#ffe4e6' : line.valid ? '#f8fafc' : '#f1f5f9'}
                        stroke={isHitLine ? '#10b981' : isMissLine ? '#f43f5e' : '#e2e8f0'}
                        strokeWidth="1"
                      />
                      <text x="10" y="18" className="text-[10px] font-mono font-bold fill-slate-700">
                        L{lIdx}: {line.valid ? `Blk ${line.blockNumber}` : '(Empty)'}
                      </text>
                      <text x="120" y="18" className="text-[9px] font-mono fill-slate-500">
                        Tag: {line.valid ? line.tagHex : '---'}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

        </svg>
      </div>

      {/* Graph Footer Helper */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono pt-2">
        <span>💡 Click on any Memory Block to inspect its mapped address.</span>
        <span>Hover over Memory Blocks or Cache Sets to isolate connection paths.</span>
      </div>

    </div>
  );
}
