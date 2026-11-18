import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ConfigPanel from './components/ConfigPanel';
import AddressDecomposer from './components/AddressDecomposer';
import CacheVisualizer from './components/CacheVisualizer';
import PipelineAnimation from './components/PipelineAnimation';
import WorkloadControl from './components/WorkloadControl';
import AnalyticsPanel from './components/AnalyticsPanel';
import ComparisonView from './components/ComparisonView';
import EducationLab from './components/EducationLab';

import { calculateCacheGeometry } from './utils/addressDecomposer';
import { createInitialCacheState, executeMemoryAccess } from './utils/cacheEngine';
import { PRESET_WORKLOADS } from './utils/presetWorkloads';

import MemoryMappingGraph from './components/MemoryMappingGraph';

export default function App() {
  const [activeTab, setActiveTab] = useState('lab');

  // Cache Configuration
  const [config, setConfig] = useState({
    mainMemorySizeBytes: 1024,
    cacheSizeBytes: 256,
    blockSizeBytes: 16,
    mappingType: 'direct',
    associativity: 2,
    replacementPolicy: 'LRU',
    writePolicy: 'write-back'
  });

  // Calculate geometry dynamically
  const geometry = calculateCacheGeometry(config);

  // Core Cache State
  const [cacheState, setCacheState] = useState(() => 
    createInitialCacheState(geometry, config.replacementPolicy, config.writePolicy)
  );

  const [currentAddress, setCurrentAddress] = useState('0x00');
  const [selectedPresetId, setSelectedPresetId] = useState('');

  // Auto-play state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [streamQueue, setStreamQueue] = useState([]);

  // Reset cache whenever geometry or configuration structural specs change
  useEffect(() => {
    setCacheState(createInitialCacheState(geometry, config.replacementPolicy, config.writePolicy));
  }, [config.mainMemorySizeBytes, config.cacheSizeBytes, config.blockSizeBytes, config.mappingType, config.associativity, config.replacementPolicy, config.writePolicy]);

  // Execute single memory access
  const handleSingleAccess = (address, isWrite = false) => {
    setCurrentAddress(address);
    setCacheState(prevState => executeMemoryAccess(prevState, address, isWrite));
  };

  // Run access stream
  const handleRunStream = (addresses) => {
    setStreamQueue(addresses);
    setIsPlaying(true);
  };

  // Auto-play interval effect
  useEffect(() => {
    let timer = null;
    if (isPlaying && streamQueue.length > 0) {
      timer = setTimeout(() => {
        const nextItem = streamQueue[0];
        setStreamQueue(prev => prev.slice(1));
        setCurrentAddress(nextItem.address);
        setCacheState(prevState => executeMemoryAccess(prevState, nextItem.address, nextItem.isWrite));
      }, playbackSpeed);
    } else if (streamQueue.length === 0 && isPlaying) {
      setIsPlaying(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, streamQueue, playbackSpeed]);

  // Load preset workload
  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    const preset = PRESET_WORKLOADS.find(p => p.id === presetId);
    if (preset) {
      const addrs = preset.generate(geometry);
      handleRunStream(addrs);
    }
  };

  // Reset cache state
  const handleResetCache = () => {
    setIsPlaying(false);
    setStreamQueue([]);
    setCacheState(createInitialCacheState(geometry, config.replacementPolicy, config.writePolicy));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white">
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetCache={handleResetCache}
        currentPreset={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        presets={PRESET_WORKLOADS}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        
        {activeTab === 'lab' && (
          <div className="space-y-6">
            
            {/* Top Config & Architecture */}
            <ConfigPanel
              config={config}
              setConfig={setConfig}
              geometry={geometry}
            />

            {/* Mermaid-style Memory Blocks to Cache Architecture Graph */}
            <MemoryMappingGraph
              geometry={geometry}
              cacheState={cacheState}
              onSelectAddress={handleSingleAccess}
            />

            {/* Address Bit Decoder */}
            <AddressDecomposer
              currentAddress={currentAddress}
              geometry={geometry}
            />

            {/* Microarchitecture Hardware Pipeline Flow */}
            <PipelineAnimation
              lastAccess={cacheState.lastAccess}
              geometry={geometry}
            />

            {/* Main Visualizer Grid & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Cache Matrix Visualizer (7 cols) */}
              <div className="lg:col-span-7 flex flex-col">
                <CacheVisualizer
                  cacheState={cacheState}
                  lastAccess={cacheState.lastAccess}
                />
              </div>

              {/* Right Column: Workload Control & Analytics (5 cols) */}
              <div className="lg:col-span-5 space-y-6 flex flex-col">
                <WorkloadControl
                  onSingleAccess={handleSingleAccess}
                  onRunStream={handleRunStream}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  playbackSpeed={playbackSpeed}
                  setPlaybackSpeed={setPlaybackSpeed}
                  presets={PRESET_WORKLOADS}
                  onSelectPreset={handleSelectPreset}
                  geometry={geometry}
                />

                <AnalyticsPanel
                  cacheState={cacheState}
                />
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Comparison View */}
        {activeTab === 'comparison' && (
          <ComparisonView presets={PRESET_WORKLOADS} />
        )}

        {/* Tab 3: Interactive Guide & Quiz */}
        {activeTab === 'lessons' && (
          <EducationLab />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 font-mono bg-white">
        Cache Memory Observer & Visualizer • Microarchitectural Simulation Engine • Direct, Fully & Set-Associative Mapping
      </footer>

    </div>
  );
}
