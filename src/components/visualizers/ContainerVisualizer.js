'use client';

import { useState } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

export default function ContainerVisualizer() {
  const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateSteps = () => {
    const steps = [];
    let left = 0;
    let right = heights.length - 1;
    let maxArea = 0;

    steps.push({
      left,
      right,
      area: (right - left) * Math.min(heights[left], heights[right]),
      maxArea: (right - left) * Math.min(heights[left], heights[right]),
      action: 'Initialize pointers at both ends'
    });

    while (left < right) {
      const width = right - left;
      const currentArea = width * Math.min(heights[left], heights[right]);
      maxArea = Math.max(maxArea, currentArea);

      const movingLeft = heights[left] < heights[right];
      
      if (movingLeft) {
        left++;
      } else {
        right--;
      }

      if (left < right) {
        const newArea = (right - left) * Math.min(heights[left], heights[right]);
        steps.push({
          left,
          right,
          area: newArea,
          maxArea: Math.max(maxArea, newArea),
          action: movingLeft 
            ? `Moved left pointer (height ${heights[left - 1]} was smaller)`
            : `Moved right pointer (height ${heights[right + 1]} was smaller)`
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

  if (isPlaying && step < steps.length - 1) {
    setTimeout(() => {
      setStep(step + 1);
    }, 1000);
  } else if (isPlaying && step >= steps.length - 1) {
    setIsPlaying(false);
  }

  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <div className="text-blue-400 text-sm mb-1">Current Area</div>
          <div className="text-2xl font-bold text-white">{currentStep.area}</div>
        </div>
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <div className="text-green-400 text-sm mb-1">Max Area</div>
          <div className="text-2xl font-bold text-white">{currentStep.maxArea}</div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-purple-400 text-sm mb-1">Step</div>
          <div className="text-2xl font-bold text-white">{step + 1} / {steps.length}</div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-4 mb-6">
        <div className="text-slate-400 text-sm mb-1">Action:</div>
        <div className="text-white">{currentStep.action}</div>
      </div>

      <div className="bg-slate-950 rounded-lg p-8 mb-6">
        <div className="flex items-end justify-center gap-2 h-64">
          {heights.map((h, i) => {
            const isLeft = i === currentStep.left;
            const isRight = i === currentStep.right;
            const isInRange = i >= currentStep.left && i <= currentStep.right;
            
            return (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="h-6 text-xs font-bold">
                  {isLeft && <span className="text-blue-400">L</span>}
                  {isRight && <span className="text-green-400">R</span>}
                </div>
                
                <div className="relative w-full flex flex-col justify-end" style={{ height: '200px' }}>
                  <div
                    className={`w-full transition-all duration-300 rounded-t ${
                      isLeft || isRight
                        ? isLeft 
                          ? 'bg-blue-500 ring-2 ring-blue-400'
                          : 'bg-green-500 ring-2 ring-green-400'
                        : isInRange
                        ? 'bg-slate-600'
                        : 'bg-slate-800'
                    }`}
                    style={{ height: `${(h / 8) * 100}%` }}
                  />
                  <div className={`text-center text-xs mt-2 ${
                    isLeft || isRight ? 'text-white font-bold' : 'text-slate-500'
                  }`}>
                    {h}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
    </div>
  );
}