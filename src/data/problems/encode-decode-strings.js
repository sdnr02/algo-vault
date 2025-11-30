const encodeDecodeStrings = {
  id: 'encode-decode-strings',
  title: 'Encode and Decode Strings',
  difficulty: 'Medium',
  pattern: 'arrays-hashing',
  leetcode: 271,
  completed: true,
  
  description: `Design an algorithm to encode a list of strings to a single string. The encoded string is then decoded back to the original list of strings.

Please implement encode and decode.

Example 1:
Input: ["neet","code","love","you"]
Output: ["neet","code","love","you"]

Example 2:
Input: ["we","say",":","yes"]
Output: ["we","say",":","yes"]

Constraints:
• 0 <= strs.length < 100
• 0 <= strs[i].length < 200
• strs[i] contains only UTF-8 characters.`,

  approach: `I used length-prefixed encoding with a delimiter:

**Encoding:**
• Handle empty list edge case → return empty string
• For each string in the list:
  - Prepend the length of the string
  - Add a delimiter "#" to separate length from content
  - Append the actual string content
• Result: "4#neet4#code4#love3#you"

**Decoding:**
• Handle empty string edge case → return empty list
• Use a pointer starting at index 0
• While not at the end:
  - Find the next "#" delimiter
  - Extract the length from the substring before "#"
  - Read exactly that many characters after "#"
  - Add the substring to result list
  - Move pointer past the current string
• Return the list of decoded strings

The key insight: Using length-prefix encoding handles edge cases like strings containing the delimiter character. We know exactly how many characters to read, so "#" in the actual string content doesn't confuse the decoder. This is more robust than using a simple delimiter that could appear in the strings themselves.`,

  pythonSolution: `class Solution:
    def encode(self, strs: List[str]) -> str:
        result_string = ""
        if strs == []:
            return result_string
        for string in strs:
            result_string = result_string + str(len(string)) + "#" + string
        return result_string
    
    def decode(self, string: str) -> List[str]:        
        result_list = []
        if string == "":
            return result_list
        i = 0
        while i < len(string):
            j = string.find('#', i)
            
            length_of_string = int(string[i:j])
            substring = string[j+1: j+length_of_string+1]
            result_list.append(substring)
            i = j + length_of_string + 1
        return result_list`,

  timeComplexity: 'O(n)',
  timeExplanation: 'Both encode and decode iterate through all characters once, where n is the total number of characters across all strings',
  spaceComplexity: 'O(1)',
  spaceExplanation: 'Excluding output space, we only use a constant amount of extra space for pointers and temporary variables',

  testCases: [
    { input: '["neet","code","love","you"]', output: '["neet","code","love","you"]' },
    { input: '["we","say",":","yes"]', output: '["we","say",":","yes"]' },
  ],

  notes: 'This encoding scheme is robust because it handles strings containing any character, including the delimiter. The length prefix tells us exactly where each string ends.'
};

export default encodeDecodeStrings;