'use client';

import { useState } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

export default function LongestConsecutiveVisualizer() {
  const examples = [
    { nums: [2, 20, 4, 10, 3, 4, 5], label: 'Example 1' },
    { nums: [0, 3, 2, 5, 4, 6, 1, 1], label: 'Example 2' },
    { nums: [100, 4, 200, 1, 3, 2], label: 'Scattered Numbers' }
  ];
  
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nums = examples[exampleIndex].nums;

  const generateSteps = () => {
    const steps = [];

    if (nums.length === 0) {
      steps.push({
        phase: 'empty',
        action: 'Array is empty, return 0'
      });
      return steps;
    }

    // Step 1: Create hash set
    const hashSet = new Set(nums);
    
    steps.push({
      phase: 'start',
      nums: nums,
      set: new Set(hashSet),
      action: 'Convert array to hash set (removes duplicates)'
    });

    let highestCount = 0;
    let longestSequence = [];

    // Step 2: Iterate through set
    for (const num of hashSet) {
      // Check if it's a sequence start
      if (hashSet.has(num - 1)) {
        steps.push({
          phase: 'checking',
          nums: nums,
          set: new Set(hashSet),
          currentNum: num,
          isStart: false,
          highestCount,
          longestSequence: [...longestSequence],
          action: `Check ${num}: ${num - 1} exists in set, not a sequence start (skip)`
        });
        continue;
      }

      // It's a sequence start
      steps.push({
        phase: 'checking',
        nums: nums,
        set: new Set(hashSet),
        currentNum: num,
        isStart: true,
        highestCount,
        longestSequence: [...longestSequence],
        action: `Check ${num}: ${num - 1} NOT in set → sequence start! Count forward...`
      });

      // Count the sequence
      let count = 0;
      const sequence = [];
      while (hashSet.has(num + count)) {
        sequence.push(num + count);
        count++;
        
        steps.push({
          phase: 'counting',
          nums: nums,
          set: new Set(hashSet),
          currentNum: num,
          sequence: [...sequence],
          count,
          highestCount,
          longestSequence: [...longestSequence],
          action: `Found ${num + count - 1} in set. Current sequence: [${sequence.join(', ')}]`
        });
      }

      // Update highest if needed
      if (count > highestCount) {
        highestCount = count;
        longestSequence = [...sequence];
        
        steps.push({
          phase: 'update',
          nums: nums,
          set: new Set(hashSet),
          currentNum: num,
          sequence: [...sequence],
          count,
          highestCount,
          longestSequence: [...longestSequence],
          newRecord: true,
          action: `New longest sequence! Length: ${count}, Sequence: [${sequence.join(', ')}]`
        });
      } else {
        steps.push({
          phase: 'continue',
          nums: nums,
          set: new Set(hashSet),
          sequence: [...sequence],
          count,
          highestCount,
          longestSequence: [...longestSequence],
          action: `Sequence length ${count} ≤ current max ${highestCount}, continue...`
        });
      }
    }

    // Final result
    steps.push({
      phase: 'complete',
      nums: nums,
      set: new Set(hashSet),
      highestCount,
      longestSequence: [...longestSequence],
      action: `Complete! Longest consecutive sequence has length ${highestCount}: [${longestSequence.join(', ')}]`
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
        <div className={`${
          currentStep?.newRecord ? 'bg-green-500/20 border-green-500/30 animate-pulse' :
          'bg-blue-500/20 border-blue-500/30'
        } border rounded-lg p-4`}>
          <div className={`${
            currentStep?.newRecord ? 'text-green-400' : 'text-blue-400'
          } text-sm mb-1`}>
            Current Count
          </div>
          <div className="text-2xl font-bold text-white">
            {currentStep?.count || 0}
          </div>
        </div>
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <div className="text-green-400 text-sm mb-1">Longest Found</div>
          <div className="text-2xl font-bold text-white">
            {currentStep?.highestCount || 0}
          </div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-purple-400 text-sm mb-1">Step</div>
          <div className="text-2xl font-bold text-white">{step + 1} / {steps.length}</div>
        </div>
      </div>

      {/* Action Description */}
      <div className={`${
        currentStep?.newRecord ? 'bg-green-500/10 border-green-500/20' :
        currentStep?.phase === 'complete' ? 'bg-green-500/10 border-green-500/20' :
        'bg-white/5'
      } border border-white/10 rounded-lg p-4 mb-6`}>
        <div className="text-slate-400 text-sm mb-1">Action:</div>
        <div className="text-white font-semibold">{currentStep?.action}</div>
      </div>

      {/* Main Visualization */}
      <div className="bg-slate-950 rounded-lg p-8 mb-6 space-y-8">
        {/* Original Array */}
        {currentStep?.nums && (
          <div>
            <div className="text-slate-400 text-sm mb-3">Original Array:</div>
            <div className="flex gap-2 flex-wrap justify-center">
              {currentStep.nums.map((num, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 font-mono"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hash Set */}
        {currentStep?.set && (
          <div>
            <div className="text-slate-400 text-sm mb-3">Hash Set (unique values):</div>
            <div className="flex gap-2 flex-wrap justify-center">
              {Array.from(currentStep.set).sort((a, b) => a - b).map((num) => {
                const isCurrentStart = num === currentStep.currentNum && currentStep.isStart;
                const isInSequence = currentStep.sequence?.includes(num);
                const isLongestSequence = currentStep.longestSequence?.includes(num);
                const isSkipped = num === currentStep.currentNum && currentStep.isStart === false;
                
                return (
                  <div
                    key={num}
                    className={`px-4 py-3 rounded-lg font-mono font-bold text-lg border-2 transition-all duration-300 ${
                      isCurrentStart
                        ? 'bg-blue-500 ring-4 ring-blue-400 text-white scale-110'
                        : isInSequence && currentStep.phase === 'counting'
                        ? 'bg-purple-500/30 border-purple-500 text-purple-400 scale-105'
                        : isLongestSequence && (currentStep.phase === 'complete' || currentStep.phase === 'update')
                        ? 'bg-green-500/30 border-green-500 text-green-400'
                        : isSkipped
                        ? 'bg-red-500/20 border-red-500/30 text-red-400'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400'
                    }`}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Current Sequence Being Counted */}
        {currentStep?.sequence && currentStep.sequence.length > 0 && (
          <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-lg p-4">
            <div className="text-purple-400 text-sm mb-3 font-bold">Current Sequence:</div>
            <div className="flex gap-2 justify-center items-center">
              {currentStep.sequence.map((num, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="px-4 py-2 bg-purple-500/30 border-2 border-purple-500 rounded-lg text-purple-400 font-mono font-bold text-xl">
                    {num}
                  </div>
                  {idx < currentStep.sequence.length - 1 && (
                    <span className="text-purple-400">→</span>
                  )}
                </div>
              ))}
              <div className="ml-4 text-purple-400 font-bold">
                Length: {currentStep.sequence.length}
              </div>
            </div>
          </div>
        )}

        {/* Longest Sequence Found */}
        {currentStep?.longestSequence && currentStep.longestSequence.length > 0 && (
          <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 text-sm mb-3 font-bold">Longest Sequence So Far:</div>
            <div className="flex gap-2 justify-center items-center">
              {currentStep.longestSequence.map((num, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="px-4 py-2 bg-green-500/30 border-2 border-green-500 rounded-lg text-green-400 font-mono font-bold text-xl">
                    {num}
                  </div>
                  {idx < currentStep.longestSequence.length - 1 && (
                    <span className="text-green-400">→</span>
                  )}
                </div>
              ))}
              <div className="ml-4 text-green-400 font-bold">
                Length: {currentStep.longestSequence.length}
              </div>
            </div>
          </div>
        )}

        {/* Final Result */}
        {currentStep?.phase === 'complete' && (
          <div className="bg-green-500/10 border-2 border-green-500 rounded-lg p-6">
            <div className="text-green-400 font-bold text-center text-xl mb-2">✓ Result</div>
            <div className="text-white text-center text-3xl font-bold">
              {currentStep.highestCount}
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
            <span className="text-slate-300">Sequence start (num-1 not in set)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-slate-300">Current sequence counting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-slate-300">Longest sequence found</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-slate-300">Not a start (num-1 exists)</span>
          </div>
        </div>
      </div>
    </div>
  );
}