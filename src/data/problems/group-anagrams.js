const groupAnagrams = {
  id: 'group-anagrams',
  title: 'Group Anagrams',
  difficulty: 'Medium',
  pattern: 'arrays-hashing',
  leetcode: 49,
  completed: true,
  
  description: `Given an array of strings strs, group all anagrams together into sublists. You may return the output in any order.

An anagram is a string that contains the exact same characters as another string, but the order of the characters can be different.

Example 1:
Input: strs = ["act","pots","tops","cat","stop","hat"]
Output: [["hat"],["act", "cat"],["stop", "pots", "tops"]]

Example 2:
Input: strs = ["x"]
Output: [["x"]]

Example 3:
Input: strs = [""]
Output: [[""]]

Constraints:
• 1 <= strs.length <= 1000
• 0 <= strs[i].length <= 100
• strs[i] is made up of lowercase English letters.`,

  approach: `I used a hash map with sorted strings as keys:

• Initialize an empty hash map to track anagram groups
• For each string in the input array:
  - Sort the characters alphabetically to create a "signature"
  - This signature will be the same for all anagrams
  - Check if this signature exists as a key in the hash map
  - If yes: append the current string to the existing group
  - If no: create a new group with this string
• Return all the groups (values from the hash map)

The key insight: Anagrams will have identical sorted strings. "act" and "cat" both sort to "act", so they're grouped together. By using the sorted string as a hash map key, we can efficiently group all anagrams in O(n * k log k) time where n is the number of strings and k is the maximum length of a string.`,

  pythonSolution: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        # Initialize a hash map
        anagram_tracker = {}
        for string in strs:
            sorted_string = ''.join(sorted(string))
            if sorted_string in anagram_tracker.keys():
                anagram_tracker[sorted_string].append(string)
            else:
                anagram_tracker[sorted_string] = [string]
        return list(anagram_tracker.values())`,

  timeComplexity: 'O(n * k log k)',
  timeExplanation: 'We iterate through n strings, and sorting each string takes O(k log k) where k is the length of the string',
  spaceComplexity: 'O(n * k)',
  spaceExplanation: 'We store all n strings in the hash map, and each sorted key has length k',

  testCases: [
    { input: '["act","pots","tops","cat","stop","hat"]', output: '[["hat"],["act","cat"],["stop","pots","tops"]]' },
    { input: '["x"]', output: '[["x"]]' },
    { input: '[""]', output: '[[""]]' },
  ],

  notes: 'Alternative approach: Use character count arrays as keys instead of sorting (O(n * k) time but more complex). Sorting is simpler and efficient enough for most cases.'
};

export default groupAnagrams;