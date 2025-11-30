const productExceptSelf = {
  id: 'product-except-self',
  title: 'Product of Array Except Self',
  difficulty: 'Medium',
  pattern: 'arrays-hashing',
  leetcode: 238,
  completed: true,
  
  description: `Given an integer array nums, return an array output where output[i] is the product of all the elements of nums except nums[i].

Each product is guaranteed to fit in a 32-bit integer.

Follow-up: Could you solve it in O(n) time without using the division operation?

Example 1:
Input: nums = [1,2,4,6]
Output: [48,24,12,8]

Example 2:
Input: nums = [-1,0,1,2,3]
Output: [0,-6,0,0,0]

Constraints:
• 2 <= nums.length <= 1000
• -20 <= nums[i] <= 20`,

  approach: `I used prefix and suffix products without division:

**Step 1: Initialize result array**
• Create an array filled with 1s (same length as input)

**Step 2: Build prefix products (left to right)**
• Use a variable 'prefix' starting at 1
• For each position i:
  - Set result[i] = prefix (product of all elements to the left)
  - Update prefix by multiplying it with nums[i]

**Step 3: Build suffix products (right to left)**
• Use a variable 'suffix' starting at 1
• For each position i (going backwards):
  - Multiply result[i] by suffix (product of all elements to the right)
  - Update suffix by multiplying it with nums[i]

**Result:** result[i] = (product of left elements) × (product of right elements)

The key insight: By doing two passes (prefix from left, suffix from right), we can calculate the product of all elements except the current one without using division. This avoids the edge case issues with zeros that a division-based approach would have.`,

  pythonSolution: `class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        product_list = []

        for i in range(0, len(nums)):
            product_list.append(1)

        prefix = 1
        for i in range(0, len(nums)):
            product_list[i] = prefix
            prefix = prefix * nums[i]

        suffix = 1
        for i in range(len(nums)-1, -1, -1):
            product_list[i] = product_list[i] * suffix
            suffix = suffix * nums[i]

        return product_list`,

  timeComplexity: 'O(n)',
  timeExplanation: 'We make two passes through the array (one for prefix, one for suffix), each taking O(n) time',
  spaceComplexity: 'O(1)',
  spaceExplanation: 'We use O(1) extra space (excluding the output array), only tracking prefix and suffix variables',

  testCases: [
    { input: '[1,2,4,6]', output: '[48,24,12,8]' },
    { input: '[-1,0,1,2,3]', output: '[0,-6,0,0,0]' },
  ],

  notes: 'This solution elegantly handles zeros without special cases. The naive division approach would fail when the array contains zeros.'
};

export default productExceptSelf;