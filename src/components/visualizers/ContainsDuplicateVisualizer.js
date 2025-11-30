'use client';

import { useState } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

export default function ContainsDuplicateVisualizer() {
  const examples = [
    { nums: [1, 2, 3, 3], label: 'Has Duplicate' },
    { nums: [1, 2, 3, 4], label: 'No Duplicate' }
  ];
  
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nums = examples[exampleIndex].nums;

  const generateSteps = () => {
    const steps = [];
    const numberTracker = new Set();
    let foundDuplicate = false;

    steps.push({
      currentIndex: -1,
      currentNumber: null,
      set: new Set(),
      foundDuplicate: false,
      action: 'Start: Initialize empty hash set'
    });

    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      
      if (numberTracker.has(num)) {
        steps.push({
          currentIndex: i,
          currentNumber: num,
          set: new Set(numberTracker),
          foundDuplicate: true,
          action: `Found ${num} in set! Duplicate detected ✓`
        });
        foundDuplicate = true;
        break;
      } else {
        steps.push({
          currentIndex: i,
          currentNumber: num,
          set: new Set(numberTracker),
          checking: true,
          foundDuplicate: false,
          action: `Checking ${num}... not in set`
        });
        
        numberTracker.add(num);
        
        steps.push({
          currentIndex: i,
          currentNumber: num,
          set: new Set(numberTracker),
          foundDuplicate: false,
          action: `Added ${num} to set`
        });
      }
    }

    if (!foundDuplicate) {
      steps.push({
        currentIndex: nums.length,
        currentNumber: null,
        set: new Set(numberTracker),
        foundDuplicate: false,
        action: 'Finished checking all elements - No duplicates found ✓'
      });
    }

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
            className={`px-4 py-2 rounded-lg font-semibold transition ${
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
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`${currentStep.foundDuplicate ? 'bg-red-500/20 border-red-500/30' : 'bg-blue-500/20 border-blue-500/30'} border rounded-lg p-4`}>
          <div className={`${currentStep.foundDuplicate ? 'text-red-400' : 'text-blue-400'} text-sm mb-1`}>
            Result
          </div>
          <div className="text-2xl font-bold text-white">
            {currentStep.foundDuplicate ? 'True' : 'False'}
          </div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-purple-400 text-sm mb-1">Step</div>
          <div className="text-2xl font-bold text-white">{step + 1} / {steps.length}</div>
        </div>
      </div>

      {/* Action Description */}
      <div className={`${currentStep.foundDuplicate ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5'} border border-white/10 rounded-lg p-4 mb-6`}>
        <div className="text-slate-400 text-sm mb-1">Action:</div>
        <div className="text-white font-semibold">{currentStep.action}</div>
      </div>

      {/* Main Visualization */}
      <div className="bg-slate-950 rounded-lg p-8 mb-6">
        {/* Array Display */}
        <div className="mb-8">
          <div className="text-slate-400 text-sm mb-3">Array:</div>
          <div className="flex gap-2 justify-center">
            {nums.map((num, i) => (
              <div
                key={i}
                className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-xl transition-all duration-300 ${
                  i === currentStep.currentIndex && currentStep.foundDuplicate
                    ? 'bg-red-500 ring-4 ring-red-400 text-white scale-110'
                    : i === currentStep.currentIndex
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
          {currentStep.currentIndex >= 0 && currentStep.currentIndex < nums.length && (
            <div className="flex gap-2 justify-center mt-2">
              {nums.map((_, i) => (
                <div key={i} className="w-16 text-center">
                  {i === currentStep.currentIndex && (
                    <div className="text-blue-400 text-xs font-bold">↑ current</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hash Set Display */}
        <div>
          <div className="text-slate-400 text-sm mb-3">
            Hash Set: <span className="text-white">number_tracker = {'{'}</span>
          </div>
          <div className="flex gap-2 flex-wrap justify-center min-h-[80px] items-center">
            {currentStep.set.size === 0 ? (
              <div className="text-slate-500 italic">empty set</div>
            ) : (
              Array.from(currentStep.set).map((num, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                    num === currentStep.currentNumber && currentStep.foundDuplicate
                      ? 'bg-red-500 ring-2 ring-red-400 text-white animate-pulse'
                      : 'bg-green-500/20 border-2 border-green-500 text-green-400'
                  }`}
                >
                  {num}
                </div>
              ))
            )}
          </div>
          <div className="text-slate-400 text-sm mt-3 text-center">
            <span className="text-white">{'}'}</span> - Size: {currentStep.set.size}
          </div>
        </div>
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
            <span className="text-slate-300">Current element checking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500/20 border-2 border-green-500 rounded"></div>
            <span className="text-slate-300">In hash set</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-slate-300">Duplicate found!</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-800 rounded"></div>
            <span className="text-slate-300">Not yet processed</span>
          </div>
        </div>
      </div>
    </div>
  );
}