const longestConsecutive = {
  id: 'longest-consecutive',
  title: 'Longest Consecutive Sequence',
  difficulty: 'Medium',
  pattern: 'arrays-hashing',
  leetcode: 128,
  completed: true,
  
  description: `Given an array of integers nums, return the length of the longest consecutive sequence of elements that can be formed.

A consecutive sequence is a sequence of elements in which each element is exactly 1 greater than the previous element. The elements do not have to be consecutive in the original array.

You must write an algorithm that runs in O(n) time.

Example 1:
Input: nums = [2,20,4,10,3,4,5]
Output: 4
Explanation: The longest consecutive sequence is [2, 3, 4, 5].

Example 2:
Input: nums = [0,3,2,5,4,6,1,1]
Output: 7

Constraints:
• 0 <= nums.length <= 1000
• -10^9 <= nums[i] <= 10^9`,

  approach: `I used a hash set to achieve O(n) time complexity:

**Step 1: Handle Edge Case**
• If the array is empty, return 0

**Step 2: Build Hash Set**
• Convert the array to a hash set to remove duplicates
• Hash set provides O(1) lookup time

**Step 3: Find Sequence Starts**
• For each number in the set:
  - Check if (num - 1) exists in the set
  - If it does NOT exist, this number is the start of a sequence
  - If it does exist, skip (we'll count from the actual start)

**Step 4: Count Sequence Length**
• Starting from each sequence start:
  - Initialize count = 0
  - While (num + count) exists in the set:
    * Increment count
  - Track the maximum count seen

**Step 5: Return Result**
• Return the highest count found

The key insight: By only starting counts from sequence beginnings (where num-1 doesn't exist), we ensure each number is visited at most twice (once for checking if it's a start, once when counting). This clever optimization achieves O(n) time complexity instead of O(n²).`,

  pythonSolution: `class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        if not nums:
            return 0
        
        hash_set = set(nums)
        highest_count = 0
        for num in hash_set:
            if (num - 1) not in hash_set:
                count = 0
                while (num + count) in hash_set:
                    count = count + 1
                if count > highest_count:
                    highest_count = count
        return highest_count`,

  timeComplexity: 'O(n)',
  timeExplanation: 'We iterate through the set once, and each element is visited at most twice (checking for sequence start + counting forward). The while loop only runs for sequence starts, making total operations O(n)',
  spaceComplexity: 'O(n)',
  spaceExplanation: 'We store all unique elements in a hash set',

  testCases: [
    { input: '[2,20,4,10,3,4,5]', output: '4' },
    { input: '[0,3,2,5,4,6,1,1]', output: '7' },
  ],

  notes: 'The naive approach of sorting would be O(n log n). The hash set approach cleverly achieves O(n) by only counting from sequence starts.'
};

export default longestConsecutive;