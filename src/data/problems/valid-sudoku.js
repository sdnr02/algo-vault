const validSudoku = {
  id: 'valid-sudoku',
  title: 'Valid Sudoku',
  difficulty: 'Medium',
  pattern: 'arrays-hashing',
  leetcode: 36,
  completed: true,
  
  description: `You are given a 9 x 9 Sudoku board board. A Sudoku board is valid if the following rules are followed:

1. Each row must contain the digits 1-9 without duplicates.
2. Each column must contain the digits 1-9 without duplicates.
3. Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without duplicates.

Return true if the Sudoku board is valid, otherwise return false.

Note: A board does not need to be full or be solvable to be valid.

Example 1:
Input: board = 
[["1","2",".",".","3",".",".",".","."],
 ["4",".",".","5",".",".",".",".","."],
 [".","9","8",".",".",".",".",".","3"],
 ["5",".",".",".","6",".",".",".","4"],
 [".",".",".","8",".","3",".",".","5"],
 ["7",".",".",".","2",".",".",".","6"],
 [".",".",".",".",".",".","2",".","."],
 [".",".",".","4","1","9",".",".","8"],
 [".",".",".",".","8",".",".","7","9"]]
Output: true

Example 2:
Input: board = 
[["1","2",".",".","3",".",".",".","."],
 ["4",".",".","5",".",".",".",".","."],
 [".","9","1",".",".",".",".",".","3"],
 ["5",".",".",".","6",".",".",".","4"],
 [".",".",".","8",".","3",".",".","5"],
 ["7",".",".",".","2",".",".",".","6"],
 [".",".",".",".",".",".","2",".","."],
 [".",".",".","4","1","9",".",".","8"],
 [".",".",".",".","8",".",".","7","9"]]
Output: false
Explanation: There are two 1's in the top-left 3x3 sub-box.

Constraints:
• board.length == 9
• board[i].length == 9
• board[i][j] is a digit 1-9 or '.'`,

  approach: `I validated the board in three separate passes using hash sets:

**Pass 1: Validate Rows**
• For each row:
  - Initialize an empty hash set
  - Iterate through each cell in the row
  - Skip empty cells (".")
  - Check if the digit is already in the set → return False
  - Add the digit to the set
  - If all rows pass, continue to columns

**Pass 2: Validate Columns**
• For each column (0-8):
  - Initialize an empty hash set
  - Iterate through each row, checking column i
  - Skip empty cells (".")
  - Check if the digit is already in the set → return False
  - Add the digit to the set
  - If all columns pass, continue to sub-boxes

**Pass 3: Validate 3x3 Sub-boxes**
• For each 3x3 box (starting positions: 0,0 then 0,3 then 0,6, etc.):
  - Initialize an empty hash set
  - Iterate through the 9 cells in that box
  - Skip empty cells (".")
  - Check if the digit is already in the set → return False
  - Add the digit to the set
  - If all 9 boxes pass, return True

The key insight: Use hash sets to detect duplicates in O(1) time. By checking rows, columns, and boxes separately with fresh sets, we ensure all Sudoku rules are validated.`,

  pythonSolution: `class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        for row in board:
            hash_set = set()
            for number in row:
                if number == ".":
                    continue
                if int(number) in hash_set:
                    return False
                
                hash_set.add(int(number))

        for i in range(0, len(board)):
            hash_set = set()
            for row in board:
                if row[i] == ".":
                    continue
                if int(row[i]) in hash_set:
                    return False

                hash_set.add(int(row[i]))

        for i in range(0, len(board), 3):
            for j in range(0, len(board[0]), 3):
                hash_set = set()

                for x in range(0,3):
                    for y in range(0,3):
                        if board[i+x][j+y] == ".":
                            continue          
                        if int(board[i+x][j+y]) in hash_set:
                            return False

                        hash_set.add(int(board[i+x][j+y]))

        return True`,

  timeComplexity: 'O(1)',
  timeExplanation: 'The board is always 9x9 (constant size), so we always check 81 cells three times = O(243) = O(1)',
  spaceComplexity: 'O(1)',
  spaceExplanation: 'Hash set stores at most 9 digits at any time, which is constant space',

  testCases: [
    { input: 'Valid board (Example 1)', output: 'true' },
    { input: 'Invalid board with duplicate in box (Example 2)', output: 'false' },
  ],

  notes: 'Alternative approach: Use a single pass with 27 hash sets (9 rows + 9 cols + 9 boxes) for O(1) space but more complex logic.'
};

export default validSudoku;