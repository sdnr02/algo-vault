'use client';

import { useState } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

export default function ValidAnagramVisualizer() {
  const examples = [
    { s: "racecar", t: "carrace", label: 'Is Anagram' },
    { s: "jar", t: "jam", label: 'Not Anagram' }
  ];
  
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const s = examples[exampleIndex].s;
  const t = examples[exampleIndex].t;

  const generateSteps = () => {
    const steps = [];
    const charCount = {};

    // Initial check
    if (s.length !== t.length) {
      steps.push({
        phase: 'check-length',
        currentIndex: -1,
        currentChar: null,
        map: {},
        isAnagram: false,
        action: `Length mismatch: s.length=${s.length}, t.length=${t.length} → return False`
      });
      return steps;
    }

    steps.push({
      phase: 'start',
      currentIndex: -1,
      currentChar: null,
      map: {},
      isAnagram: null,
      action: 'Lengths match! Start counting characters in s'
    });

    // Phase 1: Build character count from s
    for (let i = 0; i < s.length; i++) {
      const char = s[i];
      charCount[char] = (charCount[char] || 0) + 1;
      
      steps.push({
        phase: 'counting-s',
        string: 's',
        currentIndex: i,
        currentChar: char,
        map: { ...charCount },
        isAnagram: null,
        action: `s[${i}] = '${char}' → Increment count to ${charCount[char]}`
      });
    }

    steps.push({
      phase: 'transition',
      currentIndex: -1,
      currentChar: null,
      map: { ...charCount },
      isAnagram: null,
      action: 'Finished counting s. Now decrement using t'
    });

    // Phase 2: Decrement using t
    let earlyExit = false;
    for (let i = 0; i < t.length; i++) {
      const char = t[i];
      
      if (!(char in charCount)) {
        steps.push({
          phase: 'counting-t',
          string: 't',
          currentIndex: i,
          currentChar: char,
          map: { ...charCount },
          isAnagram: false,
          earlyExit: true,
          action: `t[${i}] = '${char}' → Not in map! return False`
        });
        earlyExit = true;
        break;
      }
      
      charCount[char] -= 1;
      
      steps.push({
        phase: 'counting-t',
        string: 't',
        currentIndex: i,
        currentChar: char,
        map: { ...charCount },
        isAnagram: null,
        action: `t[${i}] = '${char}' → Decrement count to ${charCount[char]}`
      });
    }

    if (earlyExit) {
      return steps;
    }

    steps.push({
      phase: 'final-check',
      currentIndex: -1,
      currentChar: null,
      map: { ...charCount },
      isAnagram: null,
      action: 'Now checking if all counts are 0...'
    });

    // Phase 3: Final check
    const allZero = Object.values(charCount).every(count => count === 0);
    
    steps.push({
      phase: 'result',
      currentIndex: -1,
      currentChar: null,
      map: { ...charCount },
      isAnagram: allZero,
      action: allZero ? 'All counts are 0 ✓ → return True' : 'Some counts ≠ 0 → return False'
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
    }, 1800);
  } else if (isPlaying && step >= steps.length - 1) {
    setIsPlaying(false);
  }

  const getCharColor = (char, index, stringType) => {
    if (stringType === currentStep.string && index === currentStep.currentIndex) {
      if (currentStep.earlyExit) {
        return 'bg-red-500 ring-4 ring-red-400 text-white scale-110';
      }
      return 'bg-blue-500 ring-4 ring-blue-400 text-white scale-110';
    }
    if (stringType === 's' && currentStep.phase === 'counting-s' && index < currentStep.currentIndex) {
      return 'bg-green-500/30 text-green-300';
    }
    if (stringType === 't' && currentStep.phase === 'counting-t' && index < currentStep.currentIndex) {
      return 'bg-purple-500/30 text-purple-300';
    }
    return 'bg-slate-800 text-slate-400';
  };

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
        <div className={`${
          currentStep.isAnagram === true ? 'bg-green-500/20 border-green-500/30' : 
          currentStep.isAnagram === false ? 'bg-red-500/20 border-red-500/30' : 
          'bg-blue-500/20 border-blue-500/30'
        } border rounded-lg p-4`}>
          <div className={`${
            currentStep.isAnagram === true ? 'text-green-400' : 
            currentStep.isAnagram === false ? 'text-red-400' : 
            'text-blue-400'
          } text-sm mb-1`}>
            Result
          </div>
          <div className="text-2xl font-bold text-white">
            {currentStep.isAnagram === null ? '...' : currentStep.isAnagram ? 'True' : 'False'}
          </div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-purple-400 text-sm mb-1">Phase</div>
          <div className="text-lg font-bold text-white">
            {currentStep.phase === 'start' || currentStep.phase === 'check-length' ? 'Setup' :
             currentStep.phase === 'counting-s' ? 'Count s' :
             currentStep.phase === 'transition' ? 'Transition' :
             currentStep.phase === 'counting-t' ? 'Count t' :
             currentStep.phase === 'final-check' ? 'Verify' : 'Done'}
          </div>
        </div>
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
          <div className="text-orange-400 text-sm mb-1">Step</div>
          <div className="text-2xl font-bold text-white">{step + 1} / {steps.length}</div>
        </div>
      </div>

      {/* Action Description */}
      <div className={`${
        currentStep.isAnagram === false ? 'bg-red-500/10 border-red-500/20' : 
        currentStep.isAnagram === true ? 'bg-green-500/10 border-green-500/20' :
        'bg-white/5'
      } border border-white/10 rounded-lg p-4 mb-6`}>
        <div className="text-slate-400 text-sm mb-1">Action:</div>
        <div className="text-white font-semibold">{currentStep.action}</div>
      </div>

      {/* Main Visualization */}
      <div className="bg-slate-950 rounded-lg p-8 mb-6 space-y-8">
        {/* String s */}
        <div>
          <div className="text-slate-400 text-sm mb-3">String s = "{s}"</div>
          <div className="flex gap-2 justify-center">
            {s.split('').map((char, i) => (
              <div
                key={i}
                className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg transition-all duration-300 ${getCharColor(char, i, 's')}`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>

        {/* String t */}
        <div>
          <div className="text-slate-400 text-sm mb-3">String t = "{t}"</div>
          <div className="flex gap-2 justify-center">
            {t.split('').map((char, i) => (
              <div
                key={i}
                className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg transition-all duration-300 ${getCharColor(char, i, 't')}`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>

        {/* Hash Map */}
        <div>
          <div className="text-slate-400 text-sm mb-3">
            character_count_tracker = {'{'}
          </div>
          <div className="flex gap-3 flex-wrap justify-center min-h-[100px] items-center">
            {Object.keys(currentStep.map).length === 0 ? (
              <div className="text-slate-500 italic">empty map</div>
            ) : (
              Object.entries(currentStep.map)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([char, count]) => (
                  <div
                    key={char}
                    className={`px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
                      char === currentStep.currentChar && currentStep.phase === 'counting-s'
                        ? 'bg-green-500/20 border-green-500 scale-110'
                        : char === currentStep.currentChar && currentStep.phase === 'counting-t'
                        ? 'bg-purple-500/20 border-purple-500 scale-110'
                        : count === 0 && currentStep.phase === 'result'
                        ? 'bg-green-500/20 border-green-500'
                        : count !== 0 && currentStep.phase === 'result'
                        ? 'bg-red-500/20 border-red-500'
                        : count > 0
                        ? 'bg-blue-500/20 border-blue-500'
                        : 'bg-orange-500/20 border-orange-500'
                    }`}
                  >
                    <div className="text-white font-mono text-center">
                      <div className="text-xl font-bold">'{char}'</div>
                      <div className={`text-2xl font-bold ${
                        count === 0 ? 'text-green-400' : 
                        count < 0 ? 'text-orange-400' : 
                        'text-blue-400'
                      }`}>
                        {count}
                      </div>
                    </div>
                  </div>
                ))
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
            <span className="text-slate-300">Current character</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500/30 rounded"></div>
            <span className="text-slate-300">Processed from s</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500/30 rounded"></div>
            <span className="text-slate-300">Processed from t</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500/20 border-2 border-blue-500 rounded"></div>
            <span className="text-slate-300">Positive count</span>
          </div>
        </div>
      </div>
    </div>
  );
}