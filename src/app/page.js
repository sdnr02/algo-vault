import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';
import patterns from '@/data/patterns';
import containerWater from '@/data/problems/container-water';
import containsDuplicate from '@/data/problems/contains-duplicate';
import validAnagram from '@/data/problems/valid-anagram';
import twoSum from '@/data/problems/two-sum';
import groupAnagrams from '@/data/problems/group-anagrams';
import topKFrequent from '@/data/problems/top-k-frequent';
import encodeDecodeStrings from '@/data/problems/encode-decode-strings';
import productExceptSelf from '@/data/problems/product-except-self';
import validSudoku from '@/data/problems/valid-sudoku';
import longestConsecutive from '@/data/problems/longest-consecutive';

const problemDataMap = {
  'container-water': containerWater,
  'contains-duplicate': containsDuplicate,
  'valid-anagram': validAnagram,
  'two-sum': twoSum,
  'group-anagrams': groupAnagrams,
  'top-k-frequent': topKFrequent,
  'encode-decode-strings': encodeDecodeStrings,
  'product-except-self': productExceptSelf,
  'valid-sudoku': validSudoku,
  'longest-consecutive': longestConsecutive,
};

export default function Home() {
  const enrichedPatterns = patterns.map(pattern => ({
    ...pattern,
    problems: pattern.problems.map(problemId => {
      const data = problemDataMap[problemId];
      return {
        id: problemId,
        title: data?.title || 'Coming Soon',
        difficulty: data?.difficulty || 'Unknown',
        completed: data?.completed || false
      };
    }).filter(p => p.title !== 'Coming Soon')
  }));

  const totalProblems = enrichedPatterns.reduce((sum, p) => sum + p.problems.length, 0);
  const completedProblems = enrichedPatterns.reduce(
    (sum, p) => sum + p.problems.filter(pr => pr.completed).length, 
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-white">AlgoVault</h1>
          <p className="text-slate-400 text-sm">My DSA Learning Journey</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <div className="text-4xl font-bold text-white">{completedProblems}</div>
            <div className="text-slate-400 text-sm mt-1">Problems Solved</div>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <div className="text-4xl font-bold text-white">{enrichedPatterns.filter(p => p.problems.length > 0).length}</div>
            <div className="text-slate-400 text-sm mt-1">Patterns Learned</div>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <div className="text-4xl font-bold text-white">
              {totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0}%
            </div>
            <div className="text-slate-400 text-sm mt-1">Progress</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Patterns</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {enrichedPatterns.map((pattern) => (
            <div 
              key={pattern.id}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {pattern.name}
                  </h3>
                  <p className="text-slate-400 text-sm">{pattern.description}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${pattern.color}`} />
              </div>

              {pattern.problems.length > 0 ? (
                <div className="space-y-2">
                  {pattern.problems.map((problem) => (
                    <Link 
                      key={problem.id}
                      href={`/problems/${pattern.id}/${problem.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition group"
                    >
                      {problem.completed ? (
                        <CheckCircle2 className={`w-5 h-5 ${
                          problem.difficulty === 'Easy' ? 'text-green-400' :
                          problem.difficulty === 'Medium' ? 'text-yellow-400' :
                          'text-red-400'
                        }`} />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600" />
                      )}
                      <div className="flex-1">
                        <div className="text-white group-hover:text-blue-400 transition">
                          {problem.title}
                        </div>
                        <div className="text-xs text-slate-500">{problem.difficulty}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500 text-sm italic">No problems added yet</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
