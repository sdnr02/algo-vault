'use client';

import { useState } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

export default function EncodeDecodeStringsVisualizer() {
  const examples = [
    { strs: ["neet", "code", "love", "you"], label: 'Standard Example' },
    { strs: ["we", "say", ":", "yes"], label: 'With Delimiter Char' },
    { strs: ["a", "", "bc"], label: 'With Empty String' }
  ];
  
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const strs = examples[exampleIndex].strs;

  const generateSteps = () => {
    const steps = [];

    // Start
    steps.push({
      phase: 'start',
      strs: strs,
      encoded: '',
      decoded: [],
      action: 'Start: Encode list of strings to single string'
    });

    // Encoding phase
    let encoded = '';
    strs.forEach((str, idx) => {
      const prefix = `${str.length}#`;
      
      steps.push({
        phase: 'encoding',
        strs: strs,
        currentEncodeIndex: idx,
        currentString: str,
        prefix: prefix,
        encoded: encoded,
        highlightEncode: true,
        action: `Encode "${str}" → length: ${str.length}, prefix: "${prefix}"`
      });

      encoded += prefix + str;

      steps.push({
        phase: 'encoding',
        strs: strs,
        currentEncodeIndex: idx,
        currentString: str,
        encoded: encoded,
        action: `Added to encoded string: "${prefix}${str}"`
      });
    });

    steps.push({
      phase: 'encode-complete',
      strs: strs,
      encoded: encoded,
      action: `Encoding complete! Result: "${encoded}"`
    });

    // Decoding phase
    steps.push({
      phase: 'decode-start',
      encoded: encoded,
      decoded: [],
      pointer: 0,
      action: 'Now decode back to list of strings'
    });

    let i = 0;
    const decoded = [];
    while (i < encoded.length) {
      const hashIdx = encoded.indexOf('#', i);
      const length = parseInt(encoded.substring(i, hashIdx));
      
      steps.push({
        phase: 'decoding',
        encoded: encoded,
        decoded: [...decoded],
        pointer: i,
        hashIdx: hashIdx,
        length: length,
        parsing: true,
        action: `Found '#' at position ${hashIdx}. Length = ${length}`
      });

      const substring = encoded.substring(hashIdx + 1, hashIdx + 1 + length);
      decoded.push(substring);

      steps.push({
        phase: 'decoding',
        encoded: encoded,
        decoded: [...decoded],
        pointer: i,
        hashIdx: hashIdx,
        length: length,
        substring: substring,
        extracting: true,
        action: `Extract ${length} characters: "${substring}"`
      });

      i = hashIdx + 1 + length;

      steps.push({
        phase: 'decoding',
        encoded: encoded,
        decoded: [...decoded],
        pointer: i,
        action: `Move pointer to position ${i}`
      });
    }

    steps.push({
      phase: 'complete',
      strs: strs,
      encoded: encoded,
      decoded: decoded,
      action: `Complete! Original list restored ✓`
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
          <div className="text-blue-400 text-sm mb-1">Strings Count</div>
          <div className="text-2xl font-bold text-white">{strs.length}</div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-purple-400 text-sm mb-1">Phase</div>
          <div className="text-lg font-bold text-white">
            {currentStep.phase.includes('encod') && !currentStep.phase.includes('complete') ? 'Encoding' :
             currentStep.phase === 'encode-complete' ? 'Encoded' :
             currentStep.phase.includes('decod') ? 'Decoding' :
             currentStep.phase === 'complete' ? 'Complete' : 'Start'}
          </div>
        </div>
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
          <div className="text-orange-400 text-sm mb-1">Step</div>
          <div className="text-2xl font-bold text-white">{step + 1} / {steps.length}</div>
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
        {/* Original List */}
        {(currentStep.phase === 'start' || currentStep.phase.includes('encod') || currentStep.phase === 'complete') && (
          <div>
            <div className="text-slate-400 text-sm mb-3">Original List:</div>
            <div className="flex gap-2 flex-wrap justify-center">
              {strs.map((str, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-3 rounded-lg border-2 font-mono transition-all duration-300 ${
                    idx === currentStep.currentEncodeIndex
                      ? 'bg-blue-500/30 border-blue-500 scale-110'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300'
                  }`}
                >
                  "{str}"
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Encoding Process */}
        {currentStep.phase.includes('encod') && currentStep.currentString !== undefined && (
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-3">Current Encoding:</div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-slate-400 text-xs mb-2">String</div>
                <div className="px-4 py-2 bg-blue-500/20 border-2 border-blue-500 rounded-lg text-white font-mono">
                  "{currentStep.currentString}"
                </div>
              </div>
              <div className="text-slate-400 text-2xl">→</div>
              <div className="text-center">
                <div className="text-slate-400 text-xs mb-2">Length Prefix</div>
                <div className="px-4 py-2 bg-purple-500/20 border-2 border-purple-500 rounded-lg text-purple-400 font-mono font-bold">
                  {currentStep.prefix}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Encoded String */}
        {currentStep.encoded !== undefined && currentStep.encoded !== '' && (
          <div>
            <div className="text-slate-400 text-sm mb-3">Encoded String:</div>
            <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-4">
              <div className="text-green-400 font-mono text-lg break-all text-center">
                "{currentStep.encoded}"
              </div>
            </div>
          </div>
        )}

        {/* Decoding Process */}
        {currentStep.phase.includes('decod') && (
          <div>
            <div className="text-slate-400 text-sm mb-3">Decoding Process:</div>
            <div className="bg-white/5 rounded-lg p-4 space-y-4">
              {/* Encoded string with pointer */}
              <div>
                <div className="text-slate-400 text-xs mb-2">Reading from position {currentStep.pointer || 0}:</div>
                <div className="font-mono text-white break-all">
                  {currentStep.encoded && currentStep.encoded.split('').map((char, idx) => (
                    <span
                      key={idx}
                      className={`${
                        idx === currentStep.pointer
                          ? 'bg-blue-500 text-white px-1 rounded'
                          : idx === currentStep.hashIdx
                          ? 'bg-purple-500 text-white px-1 rounded'
                          : idx > currentStep.hashIdx && idx <= currentStep.hashIdx + (currentStep.length || 0) && currentStep.extracting
                          ? 'bg-green-500/30 text-green-400'
                          : idx < (currentStep.pointer || 0)
                          ? 'text-slate-600'
                          : ''
                      }`}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              {/* Extracted info */}
              {currentStep.length !== undefined && (
                <div className="flex gap-4 justify-center items-center">
                  {currentStep.parsing && (
                    <div className="text-center">
                      <div className="text-slate-400 text-xs mb-1">Length Found</div>
                      <div className="px-3 py-2 bg-purple-500/20 border border-purple-500 rounded text-purple-400 font-bold">
                        {currentStep.length}
                      </div>
                    </div>
                  )}
                  {currentStep.substring && (
                    <>
                      <div className="text-slate-400 text-xl">→</div>
                      <div className="text-center">
                        <div className="text-slate-400 text-xs mb-1">Extracted String</div>
                        <div className="px-3 py-2 bg-green-500/20 border border-green-500 rounded text-green-400 font-mono">
                          "{currentStep.substring}"
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Decoded List */}
        {currentStep.decoded !== undefined && currentStep.decoded.length > 0 && (
          <div>
            <div className="text-slate-400 text-sm mb-3">Decoded List:</div>
            <div className="flex gap-2 flex-wrap justify-center">
              {currentStep.decoded.map((str, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 rounded-lg border-2 border-green-500 bg-green-500/20 text-green-400 font-mono"
                >
                  "{str}"
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Verification */}
        {currentStep.phase === 'complete' && (
          <div className="bg-green-500/10 border-2 border-green-500 rounded-lg p-6">
            <div className="text-green-400 font-bold text-center mb-4">✓ Success!</div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-slate-400 text-sm mb-2">Original:</div>
                <div className="text-white font-mono text-sm">
                  {JSON.stringify(currentStep.strs)}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-sm mb-2">Decoded:</div>
                <div className="text-green-400 font-mono text-sm">
                  {JSON.stringify(currentStep.decoded)}
                </div>
              </div>
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
            <span className="text-slate-300">Current position / element</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-slate-300">Length prefix / delimiter</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-slate-300">Extracted / decoded string</span>
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