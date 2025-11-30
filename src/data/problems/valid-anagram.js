const validAnagram = {
  id: 'valid-anagram',
  title: 'Valid Anagram',
  difficulty: 'Easy',
  pattern: 'arrays-hashing',
  leetcode: 242,
  completed: true,
  
  description: `Given two strings s and t, return true if the two strings are anagrams of each other, otherwise return false.

An anagram is a string that contains the exact same characters as another string, but the order of the characters can be different.

Example 1:
Input: s = "racecar", t = "carrace"
Output: true

Example 2:
Input: s = "jar", t = "jam"
Output: false

Constraints:
• s and t consist of lowercase English letters.`,

  approach: `I used a hash map to count character frequencies:

• First, check if strings have different lengths → instant False
• Build a hash map counting all characters in string s
• Iterate through string t, decrementing counts
  - If a character is not in the map → return False
  - If we successfully decrement all characters, continue
• Finally, check if all counts in the map are 0
  - If any count is not 0 → return False
  - If all are 0 → return True

The key insight: Anagrams must have identical character frequencies. By counting up with s and counting down with t, a valid anagram will zero out all counts.`,

  pythonSolution: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False

        # Initialize a hash map
        character_count_tracker = {}

        for character in s:
            if character in character_count_tracker.keys():
                character_count_tracker[character] = character_count_tracker[character] + 1
            else:
                character_count_tracker[character] = 1

        for character in t:
            if character in character_count_tracker.keys():
                character_count_tracker[character] = character_count_tracker[character] - 1
            else:
                return False

        for character in character_count_tracker.keys():
            if character_count_tracker.get(character) != 0:
                return False

        return True`,

  timeComplexity: 'O(n)',
  timeExplanation: 'We iterate through both strings once (O(n) each), and check all keys in the map (at most 26 for lowercase letters)',
  spaceComplexity: 'O(1)',
  spaceExplanation: 'Hash map stores at most 26 characters (lowercase English letters), which is constant space',

  testCases: [
    { input: 's = "racecar", t = "carrace"', output: 'true' },
    { input: 's = "jar", t = "jam"', output: 'false' },
  ],

  notes: 'Alternative approach: Could sort both strings and compare (O(n log n) time). The hash map approach is more efficient at O(n).'
};

export default validAnagram;