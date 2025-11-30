'use client';

import { useState } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

export default function ProductExceptSelfVisualizer() {
  const examples = [
    { nums: [1, 2, 4, 6], label: 'Standard Example' },
    { nums: [-1, 0, 1, 2, 3], label: 'With Zero' },
    { nums: [2, 3, 4, 5], label: 'All Positive' }
  ];
  
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nums = examples[exampleIndex].nums;

  const generateSteps = () => {
    const steps = [];
    const result = new Array(nums.length).fill(1);

    // Step 0: Start
    steps.push({
      phase: 'start',
      nums: nums,
      result: [...result],
      action: 'Initialize result array with 1s'
    });

    // Phase 1: Prefix products (left to right)
    let prefix = 1;
    for (let i = 0; i < nums.length; i++) {
      steps.push({
        phase: 'prefix',
        nums: nums,
        result: [...result],
        currentIndex: i,
        prefix: prefix,
        setting: true,
        action: `Set result[${i}] = prefix (${prefix})`
      });

      result[i] = prefix;

      steps.push({
        phase: 'prefix',
        nums: nums,
        result: [...result],
        currentIndex: i,
        prefix: prefix,
        multiplying: true,
        action: `Update prefix: ${prefix} × ${nums[i]} = ${prefix * nums[i]}`
      });

      prefix *= nums[i];
    }

    steps.push({
      phase: 'prefix-complete',
      nums: nums,
      result: [...result],
      prefix: prefix,
      action: 'Prefix pass complete! Now multiply by suffix products...'
    });

    // Phase 2: Suffix products (right to left)
    let suffix = 1;
    for (let i = nums.length - 1; i >= 0; i--) {
      const beforeMultiply = result[i];
      
      result[i] *= suffix;
      
      steps.push({
        phase: 'suffix',
        nums: nums,
        result: [...result],
        currentIndex: i,
        suffix: suffix,
        beforeValue: beforeMultiply,
        afterValue: result[i],
        multiplying: true,
        action: `Multiply result[${i}] by suffix: ${beforeMultiply} × ${suffix} = ${result[i]}`
      });

      const newSuffix = suffix * nums[i];
      
      steps.push({
        phase: 'suffix',
        nums: nums,
        result: [...result],
        currentIndex: i,
        suffix: suffix,
        newSuffix: newSuffix,
        updating: true,
        action: `Update suffix: ${suffix} × nums[${i}] = ${suffix} × ${nums[i]} = ${newSuffix}`
      });

      suffix = newSuffix;
    }

    // Final result
    steps.push({
      phase: 'complete',
      nums: nums,
      result: [...result],
      action: 'Complete! Each element is the product of all others ✓'
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
          currentStep.phase === 'prefix' || currentStep.phase === 'prefix-complete'
            ? 'bg-green-500/20 border-green-500/30'
            : 'bg-blue-500/20 border-blue-500/30'
        } border rounded-lg p-4`}>
          <div className={`${
            currentStep.phase === 'prefix' || currentStep.phase === 'prefix-complete'
              ? 'text-green-400'
              : 'text-blue-400'
          } text-sm mb-1`}>
            Prefix
          </div>
          <div className="text-2xl font-bold text-white">
            {currentStep.prefix !== undefined ? currentStep.prefix : '-'}
          </div>
        </div>
        <div className={`${
          currentStep.phase === 'suffix'
            ? 'bg-purple-500/20 border-purple-500/30'
            : 'bg-orange-500/20 border-orange-500/30'
        } border rounded-lg p-4`}>
          <div className={`${
            currentStep.phase === 'suffix' ? 'text-purple-400' : 'text-orange-400'
          } text-sm mb-1`}>
            Phase
          </div>
          <div className="text-lg font-bold text-white">
            {currentStep.phase === 'start' ? 'Setup' :
             currentStep.phase === 'prefix' ? 'Prefix' :
             currentStep.phase === 'prefix-complete' ? 'Transition' :
             currentStep.phase === 'suffix' ? 'Suffix' : 'Done'}
          </div>
        </div>
        <div className={`${
          currentStep.phase === 'suffix'
            ? 'bg-purple-500/20 border-purple-500/30'
            : 'bg-pink-500/20 border-pink-500/30'
        } border rounded-lg p-4`}>
          <div className={`${
            currentStep.phase === 'suffix' ? 'text-purple-400' : 'text-pink-400'
          } text-sm mb-1`}>
            Suffix
          </div>
          <div className="text-2xl font-bold text-white">
            {currentStep.suffix !== undefined ? currentStep.suffix : '-'}
          </div>
        </div>
      </div>

      {/* Action Description */}
      <div className={`${
        currentStep.phase === 'complete' ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5'
      } border border-white/10 rounded-lg p-4 mb-6`}>
        <div className="text-slate-400 text-sm mb-1">Action:</div>
        <div className="text-white font-semibold">{currentStep.action}</div>
      </div>

      {/* Main Visualization */}
      <div className="bg-slate-950 rounded-lg p-8 mb-6 space-y-8">
        {/* Input Array */}
        <div>
          <div className="text-slate-400 text-sm mb-3">Input Array (nums):</div>
          <div className="flex gap-2 justify-center">
            {nums.map((num, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-xl transition-all duration-300 ${
                    i === currentStep.currentIndex
                      ? 'bg-blue-500 ring-4 ring-blue-400 text-white scale-110'
                      : currentStep.phase === 'prefix' && i < currentStep.currentIndex
                      ? 'bg-green-500/30 text-green-300'
                      : currentStep.phase === 'suffix' && i > currentStep.currentIndex
                      ? 'bg-purple-500/30 text-purple-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {num}
                </div>
                <div className="text-xs text-slate-500">i={i}</div>
              </div>
            ))}
          </div>
          {currentStep.currentIndex !== undefined && (
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

        {/* Direction Indicator */}
        {currentStep.phase === 'prefix' && (
          <div className="flex items-center justify-center gap-2">
            <div className="text-green-400 font-bold">→→→ Prefix Pass (Left to Right) →→→</div>
          </div>
        )}
        {currentStep.phase === 'suffix' && (
          <div className="flex items-center justify-center gap-2">
            <div className="text-purple-400 font-bold">←←← Suffix Pass (Right to Left) ←←←</div>
          </div>
        )}

        {/* Result Array */}
        <div>
          <div className="text-slate-400 text-sm mb-3">Result Array:</div>
          <div className="flex gap-2 justify-center">
            {currentStep.result.map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg transition-all duration-300 ${
                    i === currentStep.currentIndex && currentStep.phase === 'prefix'
                      ? 'bg-green-500 ring-4 ring-green-400 text-white scale-110'
                      : i === currentStep.currentIndex && currentStep.phase === 'suffix'
                      ? 'bg-purple-500 ring-4 ring-purple-400 text-white scale-110'
                      : currentStep.phase === 'complete'
                      ? 'bg-green-500/30 border-2 border-green-500 text-green-400'
                      : val === 1 && currentStep.phase !== 'start'
                      ? 'bg-slate-800 text-slate-500'
                      : 'bg-blue-500/20 border border-blue-500 text-white'
                  }`}
                >
                  {val}
                </div>
                <div className="text-xs text-slate-500">i={i}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Details */}
        {currentStep.currentIndex !== undefined && (
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">Calculation at index {currentStep.currentIndex}:</div>
            <div className="text-white font-mono text-center">
              {currentStep.phase === 'prefix' && currentStep.setting && (
                <>
                  result[{currentStep.currentIndex}] = prefix = <span className="text-green-400 font-bold">{currentStep.prefix}</span>
                </>
              )}
              {currentStep.phase === 'prefix' && currentStep.multiplying && (
                <>
                  prefix = {currentStep.prefix} × nums[{currentStep.currentIndex}] = {currentStep.prefix} × {nums[currentStep.currentIndex]} = <span className="text-green-400 font-bold">{currentStep.prefix * nums[currentStep.currentIndex]}</span>
                </>
              )}
              {currentStep.phase === 'suffix' && currentStep.multiplying && (
                <>
                  result[{currentStep.currentIndex}] = {currentStep.beforeValue} × suffix = {currentStep.beforeValue} × {currentStep.suffix} = <span className="text-purple-400 font-bold">{currentStep.afterValue}</span>
                </>
              )}
              {currentStep.phase === 'suffix' && currentStep.updating && (
                <>
                  suffix = {currentStep.suffix} × nums[{currentStep.currentIndex}] = {currentStep.suffix} × {nums[currentStep.currentIndex]} = <span className="text-purple-400 font-bold">{currentStep.newSuffix}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Final Verification */}
        {currentStep.phase === 'complete' && (
          <div className="bg-green-500/10 border-2 border-green-500 rounded-lg p-6">
            <div className="text-green-400 font-bold text-center mb-4">✓ Complete!</div>
            <div className="space-y-2">
              {currentStep.result.map((val, i) => {
                const expected = nums.reduce((acc, num, idx) => idx === i ? acc : acc * num, 1);
                return (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">result[{i}] = product of all except nums[{i}] ({nums[i]})</span>
                    <span className="text-green-400 font-mono font-bold">= {val}</span>
                  </div>
                );
              })}
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
            <span className="text-slate-300">Current position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-slate-300">Prefix pass / result</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-slate-300">Suffix pass</span>
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