import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import containerWater from '@/data/problems/container-water';
import containsDuplicate from '@/data/problems/contains-duplicate';
import validAnagram from '@/data/problems/valid-anagram';
import twoSum from '@/data/problems/two-sum';
import groupAnagrams from '@/data/problems/group-anagrams';
import topKFrequent from '@/data/problems/top-k-frequent';
import encodeDecodeStrings from '@/data/problems/encode-decode-strings';
import productExceptSelf from '@/data/problems/product-except-self';

const problemsMap = {
  'container-water': containerWater,
  'contains-duplicate': containsDuplicate,
  'valid-anagram': validAnagram,
  'two-sum': twoSum,
  'group-anagrams': groupAnagrams,
  'top-k-frequent': topKFrequent,
  'encode-decode-strings': encodeDecodeStrings,
  'product-except-self': productExceptSelf,
};

const visualizerMap = {
  'container-water': dynamic(() => import('@/components/visualizers/ContainerVisualizer')),
  'contains-duplicate': dynamic(() => import('@/components/visualizers/ContainsDuplicateVisualizer')),
  'valid-anagram': dynamic(() => import('@/components/visualizers/ValidAnagramVisualizer')),
  'two-sum': dynamic(() => import('@/components/visualizers/TwoSumVisualizer')),
  'group-anagrams': dynamic(() => import('@/components/visualizers/GroupAnagramsVisualizer')),
  'top-k-frequent': dynamic(() => import('@/components/visualizers/TopKFrequentVisualizer')),
  'encode-decode-strings': dynamic(() => import('@/components/visualizers/EncodeDecodeStringsVisualizer')),
  'product-except-self': dynamic(() => import('@/components/visualizers/ProductExceptSelfVisualizer')),
};

export default async function ProblemPage({ params }) {
  const { pattern, problem } = await params;
  
  const problemData = problemsMap[problem];
  const Visualizer = visualizerMap[problem];

  if (!problemData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Problems
          </Link>
          <h1 className="text-3xl font-bold text-white">Coming Soon...</h1>
          <p className="text-slate-400 mt-2">This problem hasn't been added yet!</p>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    'Easy': 'bg-green-500/20 text-green-400',
    'Medium': 'bg-orange-500/20 text-orange-400',
    'Hard': 'bg-red-500/20 text-red-400'
  };

  const patternColors = {
    'two-pointers': 'bg-blue-500/20 text-blue-400',
    'sliding-window': 'bg-green-500/20 text-green-400',
    'arrays-hashing': 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Problems
          </Link>
          <h1 className="text-3xl font-bold text-white">{problemData.title}</h1>
          <div className="flex gap-3 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm ${patternColors[pattern]}`}>
              {pattern.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${difficultyColors[problemData.difficulty]}`}>
              {problemData.difficulty}
            </span>
            <a 
              href={`https://leetcode.com/problems/${problem}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-white/10 text-white hover:bg-white/20 rounded-full text-sm transition"
            >
              LeetCode #{problemData.leetcode}
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Problem</h2>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {problemData.description}
            </p>
          </div>
        </section>

        {Visualizer && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Visualization</h2>
            <Visualizer />
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">My Approach</h2>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {problemData.approach}
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Solution</h2>
          
          <div className="bg-slate-950 border border-white/10 rounded-xl overflow-hidden">
            <div className="bg-white/5 px-6 py-3 border-b border-white/10">
              <span className="text-blue-400 font-semibold">Python</span>
            </div>
            <pre className="p-6 overflow-x-auto">
              <code className="text-slate-300 text-sm">{problemData.pythonSolution}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Complexity Analysis</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
              <div className="text-green-400 font-semibold mb-2">Time Complexity</div>
              <div className="text-3xl font-bold text-white mb-2">{problemData.timeComplexity}</div>
              <p className="text-slate-400 text-sm">{problemData.timeExplanation}</p>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
              <div className="text-blue-400 font-semibold mb-2">Space Complexity</div>
              <div className="text-3xl font-bold text-white mb-2">{problemData.spaceComplexity}</div>
              <p className="text-slate-400 text-sm">{problemData.spaceExplanation}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}