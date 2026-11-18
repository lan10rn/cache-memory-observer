import React, { useState } from 'react';
import { BookOpen, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EducationLab() {
  const [activeConcept, setActiveConcept] = useState('direct');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const quizQuestions = [
    {
      id: 'q1',
      question: 'Which cache mapping scheme uses an Index field in the memory address?',
      options: [
        'Only Fully Associative Mapping',
        'Direct Mapping and Set-Associative Mapping',
        'None of the mapping schemes',
        'Only Set-Associative Mapping'
      ],
      correctIndex: 1,
      explanation: 'Direct Mapping and Set-Associative Mapping both use an Index field to locate the target set/line. Fully Associative has 0 index bits because any block can fit into any line.'
    },
    {
      id: 'q2',
      question: 'What is the primary disadvantage of Direct Mapping?',
      options: [
        'High hardware cost and slow tag lookup',
        'Inability to support block replacement algorithms',
        'Conflict thrashing when multiple active blocks map to the same line index',
        'High power consumption from CAM comparators'
      ],
      correctIndex: 2,
      explanation: 'Direct Mapping forces each block to a single specific cache line (Block % Lines). If a program repeatedly accesses two blocks mapping to the same line index, severe conflict thrashing occurs.'
    },
    {
      id: 'q3',
      question: 'In a 4-Way Set-Associative cache with 64 total lines, how many Sets exist?',
      options: ['16 Sets', '64 Sets', '4 Sets', '256 Sets'],
      correctIndex: 0,
      explanation: 'Number of Sets = Total Lines / Associativity (K) = 64 / 4 = 16 Sets.'
    }
  ];

  const handleSelectOption = (qId, optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    if (correctCount === quizQuestions.length) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 text-cyan-700 font-bold font-heading text-lg mb-2">
          <BookOpen className="w-6 h-6 text-cyan-600" />
          Cache Memory Mapping Architecture & Micro-Lessons
        </div>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
          Cache mapping is the hardware technique used to transfer and store blocks of data from Main Memory into CPU Cache. Explore how <strong>Direct</strong>, <strong>Fully Associative</strong>, and <strong>Set-Associative</strong> mapping schemes work under the hood.
        </p>

        {/* Concept Selector Tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setActiveConcept('direct')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
              activeConcept === 'direct'
                ? 'bg-cyan-50 text-cyan-900 border-cyan-400 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            1. Direct Mapping
          </button>

          <button
            onClick={() => setActiveConcept('fully')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
              activeConcept === 'fully'
                ? 'bg-purple-50 text-purple-900 border-purple-400 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            2. Fully Associative
          </button>

          <button
            onClick={() => setActiveConcept('set')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
              activeConcept === 'set'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-400 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            3. Set-Associative ($K$-way)
          </button>
        </div>
      </div>

      {/* Active Concept Detailed Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm">
        
        {activeConcept === 'direct' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-cyan-900 font-heading">
                Direct Mapping
              </h3>
              <span className="text-xs font-mono bg-cyan-50 text-cyan-800 px-3 py-1 rounded-full border border-cyan-300 font-bold">
                Formula: Line = Block # mod NumLines
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In <strong>Direct Mapping</strong>, each memory block maps to exactly one specific line in the cache. The target line is uniquely determined by taking the memory block number modulo the total number of cache lines (<code className="font-mono text-cyan-700 font-bold">Line = Block % NumLines</code>).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-cyan-800 mb-1">Tag Field</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <code className="text-cyan-700 font-mono font-bold">Tag Bits = Address Bits - (Index + Offset)</code>. Used to verify if the block in the line is the requested one.
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-purple-800 mb-1">Index Field</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <code className="text-purple-700 font-mono font-bold">Index Bits = log2(Num Cache Lines)</code>. Selects the exact cache line.
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-amber-800 mb-1">Offset Field</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <code className="text-amber-700 font-mono font-bold">Offset Bits = log2(Block Size)</code>. Selects the byte within the cache line.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl">
                <div className="font-bold text-emerald-800 mb-1.5">Advantages</div>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>Simplest hardware implementation (only 1 tag comparator needed).</li>
                  <li>Fastest hit access latency and lowest power consumption.</li>
                  <li>Inexpensive chip area to design.</li>
                </ul>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded-xl">
                <div className="font-bold text-rose-800 mb-1.5">Disadvantages</div>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>High risk of <strong>Conflict Misses</strong> (thrashing).</li>
                  <li>If two active memory locations share the same index, they continually evict each other.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeConcept === 'fully' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-purple-900 font-heading">
                Fully Associative Mapping
              </h3>
              <span className="text-xs font-mono bg-purple-50 text-purple-800 px-3 py-1 rounded-full border border-purple-300 font-bold">
                Index Bits = 0 (Any Line)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In <strong>Fully Associative Mapping</strong>, a block of main memory can be placed into <strong>any</strong> free cache line. When the cache is full, a replacement algorithm (such as LRU or FIFO) determines which line is evicted.
            </p>

            <div className="bg-purple-50/80 p-3.5 rounded-xl border border-purple-200 text-xs space-y-2 font-mono">
              <div className="text-purple-900 font-bold">Address Bit Structure:</div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-200 px-3 py-1 rounded text-purple-900 font-bold">TAG BITS (Total - Offset)</span>
                <span className="bg-amber-200 px-3 py-1 rounded text-amber-900 font-bold">OFFSET BITS (log2 BlockSize)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl">
                <div className="font-bold text-emerald-800 mb-1.5">Advantages</div>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>Eliminates conflict misses completely!</li>
                  <li>Maximum flexibility for placing data blocks.</li>
                  <li>Highest potential cache hit rate for complex access patterns.</li>
                </ul>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded-xl">
                <div className="font-bold text-rose-800 mb-1.5">Disadvantages</div>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>Requires N parallel hardware comparators (Content Addressable Memory - CAM).</li>
                  <li>High chip area, power consumption, and circuit complexity.</li>
                  <li>Requires replacement logic (LRU/FIFO counters).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeConcept === 'set' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-emerald-900 font-heading">
                Set-Associative Mapping (K-Way)
              </h3>
              <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300 font-bold">
                Formula: Set = Block # mod NumSets
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Set-Associative Mapping</strong> combines the best of both worlds! Cache lines are grouped into S sets, where each set contains K lines (K-way associativity). Memory block B maps to set <code className="font-mono text-emerald-700 font-bold">Set = Block % NumSets</code>, and can be placed in any of the K lines inside that set.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-emerald-800">Industry Standard Design</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Modern x86 & ARM CPUs (e.g., Intel Core, AMD Ryzen, Apple Silicon M-series) use 8-way, 12-way, or 16-way Set-Associative caches in L1/L2/L3 levels to achieve fast tag lookup while minimizing conflict misses.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Self-Assessment Quiz */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-amber-800 font-bold font-heading text-base">
            <Award className="w-5 h-5 text-amber-600" />
            Knowledge Check Quiz
          </div>
          <span className="text-xs font-mono text-slate-500">
            Test your understanding of Cache Mapping
          </span>
        </div>

        <div className="space-y-4">
          {quizQuestions.map((q, idx) => (
            <div key={q.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800">
                {idx + 1}. {q.question}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[q.id] === optIdx;
                  const isCorrect = optIdx === q.correctIndex;

                  let optStyle = 'bg-white border-slate-300 text-slate-700 hover:border-slate-400 shadow-xs';

                  if (quizSubmitted) {
                    if (isCorrect) {
                      optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-cyan-50 border-cyan-500 text-cyan-900 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => !quizSubmitted && handleSelectOption(q.id, optIdx)}
                      className={`p-2.5 rounded-lg text-xs text-left transition-all border ${optStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded border border-slate-200 mt-2 font-mono shadow-xs">
                  💡 <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSubmitQuiz}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all cursor-pointer"
          >
            Check Answers & Submit
          </button>
        </div>

      </div>

    </div>
  );
}
