const containerWater = {
  id: 'container-water',
  title: 'Container With Most Water',
  difficulty: 'Medium',
  pattern: 'two-pointers',
  leetcode: 11,
  completed: true,
  
  description: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,

  approach: `I used the two pointers technique because:

- Start with the widest container (pointers at both ends)
- The area is limited by the shorter line
- Move the pointer at the shorter line inward
- Keep track of the maximum area seen so far`,

  pythonSolution: `def maxArea(height):
    left, right = 0, len(height) - 1
    max_area = 0
    
    while left < right:
        width = right - left
        current_area = width * min(height[left], height[right])
        max_area = max(max_area, current_area)
        
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area`,

  timeComplexity: 'O(n)',
  timeExplanation: 'We visit each element at most once with our two pointers',
  spaceComplexity: 'O(1)',
  spaceExplanation: 'We only use a constant amount of extra space',
};

export default containerWater;