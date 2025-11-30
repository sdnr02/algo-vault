'use client';

import { useState } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

export default function TwoSumVisualizer() {
  const examples = [
    { nums: [3, 4, 5, 6], target: 7, label: 'Target at Start' },
    { nums: [4, 5, 6], target: 10, label: 'Target at End' },
    { nums: [5, 5], target: 10, label: 'Duplicate Values' }
  ];
  
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nums = examples[exampleIndex].nums;
  const target = examples[exampleIndex].target;

  const generateSteps = () => {
    const steps = [];
    const trackingMap = {};

    steps.push({
      currentIndex: -1,
      currentNum: null,
      complement: null,
      map: {},
      found: false,
      result: null,
      action: `Looking for two numbers that sum to ${target}`
    });

    for (let i = 0; i < nums.length; i++) {
      const currentNum = nums[i];
      const complement = target - currentNum;

      // Check if complement exists
      steps.push({
        currentIndex: i,
        currentNum,
        complement,
        map: { ...trackingMap },
        checking: true,
        found: false,
        result: null,
        action: `nums[${i}] = ${currentNum}, complement = ${target} - ${currentNum} = ${complement}. Checking map...`
      });

      if (complement in trackingMap) {
        // Found the pair!
        steps.push({
          currentIndex: i,
          currentNum,
          complement,
          map: { ...trackingMap },
          found: true,
          result: [trackingMap[complement], i],
          action: `Found ${complement} in map at index ${trackingMap[complement]}! Return [${trackingMap[complement]}, ${i}] ✓`
        });
        break;
      } else {
        // Add to map
        trackingMap[currentNum] = i;
        steps.push({
          currentIndex: i,
          currentNum,
          complement,
          map: { ...trackingMap },
          found: false,
          addedToMap: true,
          result: null,
          action: `${complement} not in map. Added {${currentNum}: ${i}} to map`
        });
      }
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
    }, 2000);
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
        <div className={`${currentStep.found ? 'bg-green-500/20 border-green-500/30' : 'bg-blue-500/20 border-blue-500/30'} border rounded-lg p-4`}>
          <div className={`${currentStep.found ? 'text-green-400' : 'text-blue-400'} text-sm mb-1`}>
            Target Sum
          </div>
          <div className="text-2xl font-bold text-white">{target}</div>
        </div>
        <div className={`${currentStep.found ? 'bg-green-500/20 border-green-500/30' : 'bg-purple-500/20 border-purple-500/30'} border rounded-lg p-4`}>
          <div className={`${currentStep.found ? 'text-green-400' : 'text-purple-400'} text-sm mb-1`}>
            Result
          </div>
          <div className="text-2xl font-bold text-white">
            {currentStep.result ? `[${currentStep.result[0]}, ${currentStep.result[1]}]` : '...'}
          </div>
        </div>
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
          <div className="text-orange-400 text-sm mb-1">Step</div>
          <div className="text-2xl font-bold text-white">{step + 1} / {steps.length}</div>
        </div>
      </div>

      {/* Action Description */}
      <div className={`${
        currentStep.found ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5'
      } border border-white/10 rounded-lg p-4 mb-6`}>
        <div className="text-slate-400 text-sm mb-1">Action:</div>
        <div className="text-white font-semibold">{currentStep.action}</div>
      </div>

      {/* Main Visualization */}
      <div className="bg-slate-950 rounded-lg p-8 mb-6 space-y-8">
        {/* Array Display */}
        <div>
          <div className="text-slate-400 text-sm mb-3">Array:</div>
          <div className="flex gap-2 justify-center">
            {nums.map((num, i) => {
              const isResult = currentStep.result && 
                (i === currentStep.result[0] || i === currentStep.result[1]);
              const isCurrent = i === currentStep.currentIndex;
              const isPast = i < currentStep.currentIndex;
              
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-xl transition-all duration-300 ${
                      isResult
                        ? 'bg-green-500 ring-4 ring-green-400 text-white scale-110'
                        : isCurrent
                        ? 'bg-blue-500 ring-4 ring-blue-400 text-white scale-110'
                        : isPast
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {num}
                  </div>
                  <div className="text-xs text-slate-500">i={i}</div>
                </div>
              );
            })}
          </div>
          {currentStep.currentIndex >= 0 && (
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

        {/* Complement Calculation */}
        {currentStep.currentNum !== null && (
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">Calculation:</div>
            <div className="text-white font-mono text-center">
              <span className="text-slate-400">complement = </span>
              <span className="text-yellow-400">{target}</span>
              <span className="text-slate-400"> - </span>
              <span className="text-blue-400">{currentStep.currentNum}</span>
              <span className="text-slate-400"> = </span>
              <span className={`text-xl font-bold ${
                currentStep.found ? 'text-green-400' : 'text-purple-400'
              }`}>
                {currentStep.complement}
              </span>
            </div>
          </div>
        )}

        {/* Hash Map Display */}
        <div>
          <div className="text-slate-400 text-sm mb-3">
            tracking_map = {'{'}
          </div>
          <div className="flex gap-3 flex-wrap justify-center min-h-[100px] items-center">
            {Object.keys(currentStep.map).length === 0 ? (
              <div className="text-slate-500 italic">empty map</div>
            ) : (
              Object.entries(currentStep.map).map(([num, idx]) => {
                const isComplement = parseInt(num) === currentStep.complement && currentStep.checking;
                const isFoundComplement = parseInt(num) === currentStep.complement && currentStep.found;
                
                return (
                  <div
                    key={num}
                    className={`px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
                      isFoundComplement
                        ? 'bg-green-500/30 border-green-500 scale-110 animate-pulse'
                        : isComplement
                        ? 'bg-yellow-500/20 border-yellow-500 scale-105'
                        : 'bg-blue-500/20 border-blue-500'
                    }`}
                  >
                    <div className="text-white font-mono text-center">
                      <div className="text-sm text-slate-400">num → index</div>
                      <div className="text-xl font-bold">
                        {num} → {idx}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="text-slate-400 text-sm mt-3 text-center">{'}'}</div>
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
            <span className="text-slate-300">Current element</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-slate-300">Solution pair found!</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-slate-300">Checking for complement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500/20 border-2 border-blue-500 rounded"></div>
            <span className="text-slate-300">Stored in map</span>
          </div>
        </div>
      </div>
    </div>
  );
}