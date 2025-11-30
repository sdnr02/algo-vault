'use client';

import { useState } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

export default function GroupAnagramsVisualizer() {
  const examples = [
    { strs: ["act", "pots", "tops", "cat", "stop", "hat"], label: 'Multiple Groups' },
    { strs: ["tea", "ate", "eat", "tan", "nat"], label: 'Two Groups' }
  ];
  
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const strs = examples[exampleIndex].strs;

  const generateSteps = () => {
    const steps = [];
    const anagramTracker = {};

    steps.push({
      currentIndex: -1,
      currentString: null,
      sortedString: null,
      map: {},
      action: 'Start: Initialize empty hash map to track anagram groups'
    });

    for (let i = 0; i < strs.length; i++) {
      const string = strs[i];
      const sortedString = string.split('').sort().join('');

      // Show the sorting step
      steps.push({
        currentIndex: i,
        currentString: string,
        sortedString: sortedString,
        sorting: true,
        map: JSON.parse(JSON.stringify(anagramTracker)),  // Deep clone
        action: `Processing "${string}" → sorted: "${sortedString}"`
      });

      // Check if key exists
      if (sortedString in anagramTracker) {
        // Add to existing group
        anagramTracker[sortedString].push(string);
        steps.push({
          currentIndex: i,
          currentString: string,
          sortedString: sortedString,
          map: JSON.parse(JSON.stringify(anagramTracker)),  // Deep clone to prevent reference issues
          addedToExisting: true,
          action: `Key "${sortedString}" exists! Added "${string}" to existing group`
        });
      } else {
        // Create new group
        anagramTracker[sortedString] = [string];
        steps.push({
          currentIndex: i,
          currentString: string,
          sortedString: sortedString,
          map: JSON.parse(JSON.stringify(anagramTracker)),  // Deep clone to prevent reference issues
          createdNew: true,
          action: `Key "${sortedString}" is new! Created group with ["${string}"]`
        });
      }
    }

    // Final result
    const result = Object.values(anagramTracker);
    steps.push({
      currentIndex: strs.length,
      currentString: null,
      sortedString: null,
      map: JSON.parse(JSON.stringify(anagramTracker)),  // Deep clone
      result: result,
      action: `Done! Return all groups: ${result.length} anagram groups found`
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
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <div className="text-blue-400 text-sm mb-1">Total Strings</div>
          <div className="text-2xl font-bold text-white">{strs.length}</div>
        </div>
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <div className="text-green-400 text-sm mb-1">Groups Found</div>
          <div className="text-2xl font-bold text-white">
            {Object.keys(currentStep.map).length}
          </div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-purple-400 text-sm mb-1">Step</div>
          <div className="text-2xl font-bold text-white">{step + 1} / {steps.length}</div>
        </div>
      </div>

      {/* Action Description */}
      <div className={`${
        currentStep.createdNew ? 'bg-green-500/10 border-green-500/20' :
        currentStep.addedToExisting ? 'bg-blue-500/10 border-blue-500/20' :
        'bg-white/5'
      } border border-white/10 rounded-lg p-4 mb-6`}>
        <div className="text-slate-400 text-sm mb-1">Action:</div>
        <div className="text-white font-semibold">{currentStep.action}</div>
      </div>

      {/* Main Visualization */}
      <div className="bg-slate-950 rounded-lg p-8 mb-6 space-y-8">
        {/* Input Array */}
        <div>
          <div className="text-slate-400 text-sm mb-3">Input Array:</div>
          <div className="flex gap-2 flex-wrap justify-center">
            {strs.map((str, i) => (
              <div
                key={i}
                className={`px-4 py-3 rounded-lg font-mono font-bold transition-all duration-300 ${
                  i === currentStep.currentIndex
                    ? 'bg-blue-500 ring-4 ring-blue-400 text-white scale-110'
                    : i < currentStep.currentIndex
                    ? 'bg-slate-700 text-slate-400'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                "{str}"
              </div>
            ))}
          </div>
        </div>

        {/* Sorting Visualization */}
        {currentStep.currentString && (
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-3">Sorting Current String:</div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-slate-400 text-xs mb-2">Original</div>
                <div className="px-6 py-3 bg-blue-500/20 border-2 border-blue-500 rounded-lg">
                  <span className="text-white font-mono text-xl font-bold">
                    "{currentStep.currentString}"
                  </span>
                </div>
              </div>
              <div className="text-slate-400 text-2xl">→</div>
              <div className="text-center">
                <div className="text-slate-400 text-xs mb-2">Sorted (Key)</div>
                <div className="px-6 py-3 bg-purple-500/20 border-2 border-purple-500 rounded-lg">
                  <span className="text-purple-400 font-mono text-xl font-bold">
                    "{currentStep.sortedString}"
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hash Map Display */}
        <div>
          <div className="text-slate-400 text-sm mb-3">
            anagram_tracker = {'{'}
          </div>
          <div className="space-y-3 min-h-[120px]">
            {Object.keys(currentStep.map).length === 0 ? (
              <div className="text-center text-slate-500 italic py-8">empty map</div>
            ) : (
              Object.entries(currentStep.map).map(([key, group]) => {
                const isCurrentKey = key === currentStep.sortedString;
                const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
                const colorIndex = Object.keys(currentStep.map).indexOf(key) % colors.length;
                
                return (
                  <div
                    key={key}
                    className={`border-2 rounded-lg p-4 transition-all duration-300 ${
                      isCurrentKey && currentStep.createdNew
                        ? 'bg-green-500/20 border-green-500 scale-105'
                        : isCurrentKey && currentStep.addedToExisting
                        ? 'bg-blue-500/20 border-blue-500 scale-105'
                        : `${colors[colorIndex]}/10 border-${colors[colorIndex].split('-')[1]}-500/30`
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="text-slate-400 text-xs mb-1">Key:</div>
                        <div className="px-3 py-1 bg-slate-800 rounded font-mono text-purple-400 font-bold">
                          "{key}"
                        </div>
                      </div>
                      <div className="text-slate-400 text-xl">→</div>
                      <div className="flex-1">
                        <div className="text-slate-400 text-xs mb-1">Group:</div>
                        <div className="flex gap-2 flex-wrap">
                          {group.map((str, i) => (
                            <div
                              key={i}
                              className={`px-3 py-1 rounded font-mono ${colors[colorIndex]}/30 border border-${colors[colorIndex].split('-')[1]}-500 text-white transition-all ${
                                str === currentStep.currentString && isCurrentKey
                                  ? 'ring-2 ring-white scale-110'
                                  : ''
                              }`}
                            >
                              "{str}"
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="text-slate-400 text-sm mt-3">{'}'}</div>
        </div>

        {/* Final Result */}
        {currentStep.result && (
          <div className="bg-green-500/10 border-2 border-green-500 rounded-lg p-4">
            <div className="text-green-400 text-sm mb-3 font-bold">Final Result:</div>
            <div className="text-white font-mono">
              {JSON.stringify(currentStep.result, null, 2)}
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
            <span className="text-slate-300">Current string processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-slate-300">Sorted key</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-slate-300">New group created</span>
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