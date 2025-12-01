'use client';

import { useState } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

export default function ValidSudokuVisualizer() {
  const examples = [
    {
      board: [
        ["5","3",".",".","7",".",".",".","."],
        ["6",".",".","1","9","5",".",".","."],
        [".","9","8",".",".",".",".","6","."],
        ["8",".",".",".","6",".",".",".","3"],
        ["4",".",".","8",".","3",".",".","1"],
        ["7",".",".",".","2",".",".",".","6"],
        [".","6",".",".",".",".","2","8","."],
        [".",".",".","4","1","9",".",".","5"],
        [".",".",".",".","8",".",".","7","9"]
      ],
      label: 'Valid Board'
    },
    {
      board: [
        ["8","3",".",".","7",".",".",".","."],
        ["6",".",".","1","9","5",".",".","."],
        [".","9","8",".",".",".",".","6","."],
        ["8",".",".",".","6",".",".",".","3"],
        ["4",".",".","8",".","3",".",".","1"],
        ["7",".",".",".","2",".",".",".","6"],
        [".","6",".",".",".",".","2","8","."],
        [".",".",".","4","1","9",".",".","5"],
        [".",".",".",".","8",".",".","7","9"]
      ],
      label: 'Invalid (Column)'
    }
  ];
  
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const board = examples[exampleIndex].board;

  const generateSteps = () => {
    const steps = [];

    steps.push({
      phase: 'start',
      action: 'Start: Validate all rows, columns, and 3x3 boxes'
    });

    // Phase 1: Check rows
    for (let row = 0; row < 9; row++) {
      const hashSet = new Set();
      
      for (let col = 0; col < 9; col++) {
        const val = board[row][col];
        
        if (val === '.') {
          steps.push({
            phase: 'rows',
            currentRow: row,
            currentCol: col,
            set: new Set(hashSet),
            action: `Row ${row}: Cell [${row},${col}] is empty, skip`
          });
          continue;
        }

        if (hashSet.has(val)) {
          steps.push({
            phase: 'rows',
            currentRow: row,
            currentCol: col,
            set: new Set(hashSet),
            duplicate: val,
            invalid: true,
            action: `Row ${row}: Found duplicate '${val}' at [${row},${col}]! Invalid ✗`
          });
          return steps;
        }

        hashSet.add(val);
        steps.push({
          phase: 'rows',
          currentRow: row,
          currentCol: col,
          set: new Set(hashSet),
          action: `Row ${row}: Added '${val}' to set`
        });
      }
    }

    steps.push({
      phase: 'rows-complete',
      action: 'All rows valid ✓ Now checking columns...'
    });

    // Phase 2: Check columns
    for (let col = 0; col < 9; col++) {
      const hashSet = new Set();
      
      for (let row = 0; row < 9; row++) {
        const val = board[row][col];
        
        if (val === '.') {
          steps.push({
            phase: 'columns',
            currentRow: row,
            currentCol: col,
            set: new Set(hashSet),
            action: `Column ${col}: Cell [${row},${col}] is empty, skip`
          });
          continue;
        }

        if (hashSet.has(val)) {
          steps.push({
            phase: 'columns',
            currentRow: row,
            currentCol: col,
            set: new Set(hashSet),
            duplicate: val,
            invalid: true,
            action: `Column ${col}: Found duplicate '${val}' at [${row},${col}]! Invalid ✗`
          });
          return steps;
        }

        hashSet.add(val);
        steps.push({
          phase: 'columns',
          currentRow: row,
          currentCol: col,
          set: new Set(hashSet),
          action: `Column ${col}: Added '${val}' to set`
        });
      }
    }

    steps.push({
      phase: 'columns-complete',
      action: 'All columns valid ✓ Now checking 3x3 boxes...'
    });

    // Phase 3: Check 3x3 boxes
    for (let boxRow = 0; boxRow < 9; boxRow += 3) {
      for (let boxCol = 0; boxCol < 9; boxCol += 3) {
        const hashSet = new Set();
        
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const row = boxRow + r;
            const col = boxCol + c;
            const val = board[row][col];
            
            if (val === '.') {
              steps.push({
                phase: 'boxes',
                currentRow: row,
                currentCol: col,
                boxRow,
                boxCol,
                set: new Set(hashSet),
                action: `Box [${boxRow/3},${boxCol/3}]: Cell [${row},${col}] is empty, skip`
              });
              continue;
            }

            if (hashSet.has(val)) {
              steps.push({
                phase: 'boxes',
                currentRow: row,
                currentCol: col,
                boxRow,
                boxCol,
                set: new Set(hashSet),
                duplicate: val,
                invalid: true,
                action: `Box [${boxRow/3},${boxCol/3}]: Found duplicate '${val}' at [${row},${col}]! Invalid ✗`
              });
              return steps;
            }

            hashSet.add(val);
            steps.push({
              phase: 'boxes',
              currentRow: row,
              currentCol: col,
              boxRow,
              boxCol,
              set: new Set(hashSet),
              action: `Box [${boxRow/3},${boxCol/3}]: Added '${val}' to set`
            });
          }
        }
      }
    }

    steps.push({
      phase: 'complete',
      action: 'All boxes valid ✓ Board is valid!'
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
    }, 800);
  } else if (isPlaying && step >= steps.length - 1) {
    setIsPlaying(false);
  }

  const getCellColor = (row, col) => {
    if (!currentStep) return 'bg-slate-800 text-slate-400';
    
    if (currentStep.invalid && row === currentStep.currentRow && col === currentStep.currentCol) {
      return 'bg-red-500 ring-4 ring-red-400 text-white scale-110';
    }
    
    if (row === currentStep.currentRow && col === currentStep.currentCol) {
      return 'bg-blue-500 ring-2 ring-blue-400 text-white scale-105';
    }
    
    if (currentStep.phase === 'rows' && row === currentStep.currentRow) {
      return 'bg-green-500/20 border-green-500 text-green-300';
    }
    
    if (currentStep.phase === 'columns' && col === currentStep.currentCol) {
      return 'bg-purple-500/20 border-purple-500 text-purple-300';
    }
    
    if (currentStep.phase === 'boxes' && 
        row >= currentStep.boxRow && row < currentStep.boxRow + 3 &&
        col >= currentStep.boxCol && col < currentStep.boxCol + 3) {
      return 'bg-orange-500/20 border-orange-500 text-orange-300';
    }
    
    return 'bg-slate-800/50 border-slate-700 text-slate-400';
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
            {example.label}
          </button>
        ))}
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`${
          currentStep?.invalid ? 'bg-red-500/20 border-red-500/30' :
          currentStep?.phase === 'complete' ? 'bg-green-500/20 border-green-500/30' :
          'bg-blue-500/20 border-blue-500/30'
        } border rounded-lg p-4`}>
          <div className={`${
            currentStep?.invalid ? 'text-red-400' :
            currentStep?.phase === 'complete' ? 'text-green-400' :
            'text-blue-400'
          } text-sm mb-1`}>
            Status
          </div>
          <div className="text-2xl font-bold text-white">
            {currentStep?.invalid ? 'Invalid' : currentStep?.phase === 'complete' ? 'Valid' : 'Checking...'}
          </div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-purple-400 text-sm mb-1">Phase</div>
          <div className="text-lg font-bold text-white">
            {!currentStep ? 'Start' :
             currentStep.phase === 'start' ? 'Setup' :
             currentStep.phase === 'rows' || currentStep.phase === 'rows-complete' ? 'Rows' :
             currentStep.phase === 'columns' || currentStep.phase === 'columns-complete' ? 'Columns' :
             currentStep.phase === 'boxes' ? 'Boxes' : 'Complete'}
          </div>
        </div>
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
          <div className="text-orange-400 text-sm mb-1">Step</div>
          <div className="text-2xl font-bold text-white">{step + 1} / {steps.length}</div>
        </div>
      </div>

      {/* Action Description */}
      <div className={`${
        currentStep?.invalid ? 'bg-red-500/10 border-red-500/20' :
        currentStep?.phase === 'complete' ? 'bg-green-500/10 border-green-500/20' :
        'bg-white/5'
      } border border-white/10 rounded-lg p-4 mb-6`}>
        <div className="text-slate-400 text-sm mb-1">Action:</div>
        <div className="text-white font-semibold">{currentStep?.action}</div>
      </div>

      {/* Main Visualization */}
      <div className="bg-slate-950 rounded-lg p-6 mb-6 space-y-6">
        {/* Sudoku Board */}
        <div className="flex justify-center">
          <div className="inline-grid grid-cols-9 gap-0.5 bg-slate-600 p-0.5 rounded-lg">
            {board.map((row, r) => (
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`w-10 h-10 flex items-center justify-center font-bold text-lg border transition-all duration-200 ${
                    getCellColor(r, c)
                  } ${
                    c % 3 === 2 && c !== 8 ? 'border-r-2 border-r-slate-600' : ''
                  } ${
                    r % 3 === 2 && r !== 8 ? 'border-b-2 border-b-slate-600' : ''
                  }`}
                >
                  {cell === '.' ? '' : cell}
                </div>
              ))
            ))}
          </div>
        </div>

        {/* Hash Set Display */}
        {currentStep?.set && (
          <div>
            <div className="text-slate-400 text-sm mb-3">Current Hash Set:</div>
            <div className="flex gap-2 flex-wrap justify-center min-h-[60px] items-center bg-white/5 rounded-lg p-4">
              {currentStep.set.size === 0 ? (
                <div className="text-slate-500 italic">empty set</div>
              ) : (
                Array.from(currentStep.set).map((num) => (
                  <div
                    key={num}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-xl transition-all ${
                      num === currentStep.duplicate
                        ? 'bg-red-500 ring-2 ring-red-400 text-white animate-pulse'
                        : 'bg-blue-500/30 border-2 border-blue-500 text-blue-400'
                    }`}
                  >
                    {num}
                  </div>
                ))
              )}
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
            <span className="text-slate-300">Current cell checking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-slate-300">Current row</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-slate-300">Current column</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-slate-300">Current 3x3 box</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-slate-300">Duplicate found!</span>
          </div>
        </div>
      </div>
    </div>
  );
}