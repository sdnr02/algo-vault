const twoSum = {
  id: 'two-sum',
  title: 'Two Sum',
  difficulty: 'Easy',
  pattern: 'arrays-hashing',
  leetcode: 1,
  completed: true,
  
  description: `Given an array of integers nums and an integer target, return the indices i and j such that nums[i] + nums[j] == target and i != j.

You may assume that every input has exactly one pair of indices i and j that satisfy the condition.

Return the answer with the smaller index first.

Example 1:
Input: nums = [3,4,5,6], target = 7
Output: [0,1]
Explanation: nums[0] + nums[1] == 7, so we return [0, 1].

Example 2:
Input: nums = [4,5,6], target = 10
Output: [0,2]

Example 3:
Input: nums = [5,5], target = 10
Output: [0,1]

Constraints:
• 2 <= nums.length <= 1000
• -10,000,000 <= nums[i] <= 10,000,000
• -10,000,000 <= target <= 10,000,000
• Only one valid answer exists.`,

  approach: `I used a hash map to store numbers and their indices as I iterate:

• Initialize an empty hash map
• For each number in the array:
  - Calculate the complement (target - current number)
  - Check if the complement exists in the hash map
  - If yes: we found our pair! Return [complement_index, current_index]
  - If no: add current number and its index to the map
• Continue until we find the pair

The key insight: Instead of checking every pair (O(n²)), we use a hash map to check if the complement exists in O(1) time. This gives us an overall O(n) solution with a single pass through the array.`,

  pythonSolution: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Initialize a hash map
        tracking_map = {}
        for i in range(0, len(nums)):
            complement = target - nums[i]
            if complement in tracking_map.keys():
                return [tracking_map.get(complement), i]
            
            tracking_map[nums[i]] = i
        return [0,0]`,

  timeComplexity: 'O(n)',
  timeExplanation: 'We iterate through the array once, and hash map lookups are O(1)',
  spaceComplexity: 'O(n)',
  spaceExplanation: 'In the worst case, we store all n elements in the hash map before finding the answer',

  testCases: [
    { input: 'nums = [3,4,5,6], target = 7', output: '[0,1]' },
    { input: 'nums = [4,5,6], target = 10', output: '[0,2]' },
    { input: 'nums = [5,5], target = 10', output: '[0,1]' },
  ],

  notes: 'Brute force solution would be O(n²) with nested loops. Hash map optimization brings it down to O(n) with O(n) space - classic time-space tradeoff.'
};

export default twoSum;