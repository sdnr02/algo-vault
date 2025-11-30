const topKFrequent = {
  id: 'top-k-frequent',
  title: 'Top K Frequent Elements',
  difficulty: 'Medium',
  pattern: 'arrays-hashing',
  leetcode: 347,
  completed: true,
  
  description: `Given an integer array nums and an integer k, return the k most frequent elements within the array.

The test cases are generated such that the answer is always unique.

You may return the output in any order.

Example 1:
Input: nums = [1,2,2,3,3,3], k = 2
Output: [2,3]

Example 2:
Input: nums = [7,7], k = 1
Output: [7]

Constraints:
• 1 <= nums.length <= 10^4
• -1000 <= nums[i] <= 1000
• 1 <= k <= number of distinct elements in nums`,

  approach: `I used a hash map to count frequencies, then sorted by frequency:

• Initialize an empty hash map to track element counts
• Iterate through the array:
  - For each number, increment its count in the map
  - If it's a new number, initialize its count to 1
• Sort the hash map by values (frequencies) in descending order
• Return the first k keys (the k most frequent elements)

The key insight: By counting frequencies with a hash map and sorting by those frequencies, we can identify the most common elements. The sorting step gives us O(n log n) time complexity, where n is the number of distinct elements.

Alternative approach: Use a heap (priority queue) for O(n log k) time, or bucket sort for O(n) time with O(n) space.`,

  pythonSolution: `class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        count_tracker = {}
        for num in nums:
            if num in count_tracker:
                count_tracker[num] = count_tracker[num] + 1
            else:
                count_tracker[num] = 1
        
        count_tracker = dict(sorted(count_tracker.items(), key=lambda x: x[1], reverse=True))
        return list(count_tracker)[:k]`,

  timeComplexity: 'O(n log n)',
  timeExplanation: 'We iterate through the array once O(n) to build the hash map, then sort the n distinct elements O(n log n)',
  spaceComplexity: 'O(n)',
  spaceExplanation: 'Hash map stores at most n distinct elements',

  testCases: [
    { input: 'nums = [1,2,2,3,3,3], k = 2', output: '[2,3]' },
    { input: 'nums = [7,7], k = 1', output: '[7]' },
  ],

  notes: 'More optimal solution using bucket sort achieves O(n) time complexity. Heap approach gives O(n log k) which is better when k is small.'
};

export default topKFrequent;