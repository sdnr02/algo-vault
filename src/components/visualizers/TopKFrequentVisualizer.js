'use client';

import { useState } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

export default function TopKFrequentVisualizer() {
  const examples = [
    { nums: [1, 2, 2, 3, 3, 3], k: 2, label: 'Multiple Elements' },
    { nums: [7, 7], k: 1, label: 'Single Element' },
    { nums: [4, 1, 1, 1, 2, 2, 3], k: 2, label: 'Three Distinct' }
  ];
  
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nums = examples[exampleIndex].nums;
  const k = examples[exampleIndex].k;

  const generateSteps = () => {
    const steps = [];
    const countTracker = {};

    steps.push({
      phase: 'start',
      currentIndex: -1,
      currentNum: null,
      map: {},
      sorted: false,
      result: null,
      action: 'Start: Initialize empty hash map to count frequencies'
    });

    // Phase 1: Build frequency map
    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      
      if (num in countTracker) {
        countTracker[num]++;
        steps.push({
          phase: 'counting',
          currentIndex: i,
          currentNum: num,
          map: JSON.parse(JSON.stringify(countTracker)),
          sorted: false,
          result: null,
          action: `nums[${i}] = ${num} → Increment count to ${countTracker[num]}`
        });
      } else {
        countTracker[num] = 1;
        steps.push({
          phase: 'counting',
          currentIndex: i,
          currentNum: num,
          map: JSON.parse(JSON.stringify(countTracker)),
          sorted: false,
          result: null,
          action: `nums[${i}] = ${num} → New element, initialize count to 1`
        });
      }
    }

    steps.push({
      phase: 'transition',
      currentIndex: nums.length,
      currentNum: null,
      map: JSON.parse(JSON.stringify(countTracker)),
      sorted: false,
      result: null,
      action: 'Finished counting. Now sort by frequency (descending)...'
    });

    // Phase 2: Sort by frequency
    const sortedEntries = Object.entries(countTracker).sort((a, b) => b[1] - a[1]);
    
    steps.push({
      phase: 'sorted',
      currentIndex: nums.length,
      currentNum: null,
      map: JSON.parse(JSON.stringify(countTracker)),
      sortedEntries: JSON.parse(JSON.stringify(sortedEntries)),
      sorted: true,
      result: null,
      action: 'Sorted by frequency! Now select top k elements...'
    });

    // Phase 3: Get top k
    const result = sortedEntries.slice(0, k).map(([num]) => parseInt(num));
    
    steps.push({
      phase: 'result',
      currentIndex: nums.length,
      currentNum: null,
      map: JSON.parse(JSON.stringify(countTracker)),
      sortedEntries: JSON.parse(JSON.stringify(sortedEntries)),
      sorted: true,
      result: result,
      action: `Return top ${k} elements: [${result.join(', ')}] ✓`
    });

    return steps;
  };

  const steps = generateSteps();
  const currentStep = steps[step];

  const handlePlay = () => {
    if (step >= steps.length - 1) {
      setStep(0);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const switchExample = (index) => {
    setExampleIndex(index);
    setStep(0);
    setIsPlaying(false);
  };

  if (isPlaying && step < steps.length - 1) {
    setTimeout(() => {
      setStep(step + 1);
    }, 1500);
  } else if (isPlaying && step >= steps.length - 1) {
    setIsPlaying(false);
  }

  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
      {/* Example Tabs */}
      <div className="flex gap-2 mb-6">
        {examples.map((example, i) => (
          <button
            key={i}
            onClick={() => switchExample(i)}
            className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
              exampleIndex === i
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Example {i + 1}: {example.label}
          </button>
        ))}
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <div className="text-blue-400 text-sm mb-1">Target k</div>
          <div className="text-2xl font-bold text-white">{k}</div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-purple-400 text-sm mb-1">Phase</div>
          <div className="text-lg font-bold text-white">
            {currentStep.phase === 'start' ? 'Setup' :
             currentStep.phase === 'counting' ? 'Counting' :
             currentStep.phase === 'transition' ? 'Transition' :
             currentStep.phase === 'sorted' ? 'Sorted' : 'Done'}
          </div>
        </div>
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
          <div className="text-orange-400 text-sm mb-1">Step</div>
          <div className="text-2xl font-bold text-white">{step + 1} / {steps.length}</div>
        </div>
      </div>

      {/* Action Description */}
      <div className={`${
        currentStep.phase === 'result' ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5'
      } border border-white/10 rounded-lg p-4 mb-6`}>
        <div className="text-slate-400 text-sm mb-1">Action:</div>
        <div className="text-white font-semibold">{currentStep.action}</div>
      </div>

      {/* Main Visualization */}
      <div className="bg-slate-950 rounded-lg p-8 mb-6 space-y-8">
        {/* Array Display */}
        <div>
          <div className="text-slate-400 text-sm mb-3">Input Array:</div>
          <div className="flex gap-2 justify-center flex-wrap">
            {nums.map((num, i) => (
              <div
                key={i}
                className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold text-lg transition-all duration-300 ${
                  i === currentStep.currentIndex
                    ? 'bg-blue-500 ring-4 ring-blue-400 text-white scale-110'
                    : i < currentStep.currentIndex
                    ? 'bg-slate-700 text-slate-300'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Frequency Map (Unsorted) */}
        {!currentStep.sorted && (
          <div>
            <div className="text-slate-400 text-sm mb-3">
              count_tracker = {'{'}
            </div>
            <div className="flex gap-3 flex-wrap justify-center min-h-[100px] items-center">
              {Object.keys(currentStep.map).length === 0 ? (
                <div className="text-slate-500 italic">empty map</div>
              ) : (
                Object.entries(currentStep.map).map(([num, count]) => (
                  <div
                    key={num}
                    className={`px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
                      parseInt(num) === currentStep.currentNum
                        ? 'bg-blue-500/30 border-blue-500 scale-110'
                        : 'bg-purple-500/20 border-purple-500'
                    }`}
                  >
                    <div className="text-white font-mono text-center">
                      <div className="text-sm text-slate-400">num → count</div>
                      <div className="text-xl font-bold">
                        {num} → <span className="text-blue-400">{count}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="text-slate-400 text-sm mt-3">{'}'}</div>
          </div>
        )}

        {/* Sorted Map */}
        {currentStep.sorted && currentStep.sortedEntries && (
          <div>
            <div className="text-slate-400 text-sm mb-3">
              Sorted by frequency (descending):
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              {currentStep.sortedEntries.map(([num, count], idx) => {
                const isTopK = currentStep.result && currentStep.result.includes(parseInt(num));
                
                return (
                  <div
                    key={num}
                    className={`px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
                      isTopK
                        ? 'bg-green-500/30 border-green-500 scale-110 ring-2 ring-green-400'
                        : 'bg-purple-500/20 border-purple-500'
                    }`}
                  >
                    <div className="text-white font-mono text-center">
                      <div className="text-xs text-slate-400 mb-1">Rank #{idx + 1}</div>
                      <div className="text-xl font-bold">
                        {num}
                      </div>
                      <div className="text-2xl font-bold text-blue-400 mt-1">
                        ×{count}
                      </div>
                      {isTopK && (
                        <div className="text-xs text-green-400 mt-1 font-bold">✓ Top {k}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Final Result */}
        {currentStep.result && (
          <div className="bg-green-500/10 border-2 border-green-500 rounded-lg p-4">
            <div className="text-green-400 text-sm mb-2 font-bold">Result:</div>
            <div className="text-white font-mono text-center text-2xl">
              [{currentStep.result.join(', ')}]
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition font-semibold"
        >
          <Play className="w-4 h-4" />
          {step >= steps.length - 1 ? 'Replay' : 'Play'}
        </button>
        <button
          onClick={handleNext}
          disabled={step >= steps.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition"
        >
          <SkipForward className="w-4 h-4" />
          Next
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="text-slate-400 text-sm mb-2">Legend:</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-slate-300">Current element</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-slate-300">Frequency count</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-slate-300">Top k element</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-700 rounded"></div>
            <span className="text-slate-300">Already processed</span>
          </div>
        </div>
      </div>
    </div>
  );
}