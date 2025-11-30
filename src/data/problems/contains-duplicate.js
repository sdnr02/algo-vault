const containsDuplicate = {
  id: 'contains-duplicate',
  title: 'Contains Duplicate',
  difficulty: 'Easy',
  pattern: 'arrays-hashing',
  leetcode: 217,
  completed: true,
  
  description: `Given an integer array nums, return true if any value appears more than once in the array, otherwise return false.

Example 1:
Input: nums = [1, 2, 3, 3]
Output: true

Example 2:
Input: nums = [1, 2, 3, 4]
Output: false`,

  approach: `I used a hash set to track numbers I've seen:

- Initialize an empty set to store seen numbers
- Iterate through the array once
- For each number, check if it's already in the set
- If yes, we found a duplicate → return True
- If no, add it to the set and continue
- If we finish the loop without finding duplicates → return False

The key insight: Hash set lookup is O(1), so we can check for duplicates in a single pass.`,

  pythonSolution: `class Solution:
    def hasDuplicate(self, nums: List[int]) -> bool:
        # Initializing a hash set
        number_tracker = set()
        # Initializing a boolean to track
        has_duplicate_flag = False
        # Iterating through the list O(n)
        for number in nums:
            if number in number_tracker:
                has_duplicate_flag = True
                break
            number_tracker.add(number)
        return has_duplicate_flag`,

  timeComplexity: 'O(n)',
  timeExplanation: 'We iterate through the array once, and set operations are O(1)',
  spaceComplexity: 'O(n)',
  spaceExplanation: 'In worst case (no duplicates), we store all n elements in the set',

  testCases: [
    { input: '[1, 2, 3, 3]', output: 'true' },
    { input: '[1, 2, 3, 4]', output: 'false' },
  ],

  notes: 'Could also use len(nums) != len(set(nums)) as a one-liner, but the iterative approach is clearer and can return early.'
};

export default containsDuplicate;