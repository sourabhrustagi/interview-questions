// ==========================================================
// DSA (Easy) — Batch 6 (Java)
// 50 classic easy-tier Data Structures & Algorithms questions,
// spanning arrays/strings, hashing/two-pointers, linked lists,
// stacks/queues/trees, and recursion/DP/math. Java solutions.
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "dsa-b6-01",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Arrays & Strings",
  "title": "Two Sum",
  "difficulty": "Junior",
  "tags": [
    "Hash Map",
    "Array",
    "Arrays & Strings"
  ],
  "question": "Given an array of integers and a target, return the indices of the two numbers that add up to the target.",
  "answer": "<p>Use a hash map from value to index. For each number, check whether <code>target - number</code> was already seen; if so, those two indices are the answer. One pass, no nested loop.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(n) space.</p>",
  "codeLanguage": "java",
  "code": "public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> seen = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (seen.containsKey(complement)) return new int[]{seen.get(complement), i};\n        seen.put(nums[i], i);\n    }\n    return new int[]{};\n}"
},
{
  "id": "dsa-b6-02",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Arrays & Strings",
  "title": "Valid Anagram",
  "difficulty": "Junior",
  "tags": [
    "Hashing",
    "String",
    "Arrays & Strings"
  ],
  "question": "Given two strings, determine if the second is an anagram of the first.",
  "answer": "<p>Two strings are anagrams if they have identical character counts. Count characters in the first string, decrement for each character in the second, and check every count returns to zero.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space (fixed alphabet).</p>",
  "codeLanguage": "java",
  "code": "public boolean isAnagram(String s, String t) {\n    if (s.length() != t.length()) return false;\n    int[] counts = new int[26];\n    for (char c : s.toCharArray()) counts[c - 'a']++;\n    for (char c : t.toCharArray()) counts[c - 'a']--;\n    for (int count : counts) {\n        if (count != 0) return false;\n    }\n    return true;\n}"
},
{
  "id": "dsa-b6-03",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Arrays & Strings",
  "title": "Contains Duplicate",
  "difficulty": "Junior",
  "tags": [
    "Hash Set",
    "Array",
    "Arrays & Strings"
  ],
  "question": "Given an array of integers, determine if any value appears at least twice.",
  "answer": "<p>Walk the array adding each element to a hash set; if an element is already present, a duplicate exists.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(n) space.</p>",
  "codeLanguage": "java",
  "code": "public boolean containsDuplicate(int[] nums) {\n    Set<Integer> seen = new HashSet<>();\n    for (int n : nums) {\n        if (!seen.add(n)) return true;\n    }\n    return false;\n}"
},
{
  "id": "dsa-b6-04",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Arrays & Strings",
  "title": "Best Time to Buy and Sell Stock",
  "difficulty": "Junior",
  "tags": [
    "Array",
    "Greedy",
    "Arrays & Strings"
  ],
  "question": "Given an array of daily stock prices, find the maximum profit from one buy followed by one later sell.",
  "answer": "<p>Track the lowest price seen so far while scanning left to right, and at each day compute the profit if sold today (`price - minPriceSoFar`), keeping the best. No need to try every pair.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public int maxProfit(int[] prices) {\n    int minPrice = Integer.MAX_VALUE;\n    int maxProfit = 0;\n    for (int price : prices) {\n        minPrice = Math.min(minPrice, price);\n        maxProfit = Math.max(maxProfit, price - minPrice);\n    }\n    return maxProfit;\n}"
},
{
  "id": "dsa-b6-05",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Arrays & Strings",
  "title": "Maximum Subarray (Kadane's Algorithm)",
  "difficulty": "Junior",
  "tags": [
    "Array",
    "Dynamic Programming",
    "Kadane's",
    "Arrays & Strings"
  ],
  "question": "Find the contiguous subarray with the largest sum, and return that sum.",
  "answer": "<p>Kadane's algorithm: at each element, decide whether to extend the current subarray or start a new one at the current element — <code>maxEndingHere = max(nums[i], maxEndingHere + nums[i])</code>. Track the best value seen across the whole scan.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public int maxSubArray(int[] nums) {\n    int maxSoFar = nums[0];\n    int maxEndingHere = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);\n        maxSoFar = Math.max(maxSoFar, maxEndingHere);\n    }\n    return maxSoFar;\n}"
},
{
  "id": "dsa-b6-06",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Arrays & Strings",
  "title": "Move Zeroes",
  "difficulty": "Junior",
  "tags": [
    "Array",
    "Two Pointers",
    "Arrays & Strings"
  ],
  "question": "Given an array, move all zeroes to the end while keeping the relative order of the non-zero elements, in place.",
  "answer": "<p>Two-pointer: <code>writeIndex</code> tracks where the next non-zero value should go. Scan the array once, copying every non-zero value forward; then fill everything after <code>writeIndex</code> with zero.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) extra space.</p>",
  "codeLanguage": "java",
  "code": "public void moveZeroes(int[] nums) {\n    int writeIndex = 0;\n    for (int n : nums) {\n        if (n != 0) nums[writeIndex++] = n;\n    }\n    while (writeIndex < nums.length) nums[writeIndex++] = 0;\n}"
},
{
  "id": "dsa-b6-07",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Arrays & Strings",
  "title": "Merge Sorted Array",
  "difficulty": "Junior",
  "tags": [
    "Array",
    "Two Pointers",
    "Arrays & Strings"
  ],
  "question": "Merge two sorted integer arrays nums1 and nums2 into nums1 in sorted order in place, where nums1 has extra trailing space for nums2's elements.",
  "answer": "<p>Merge from the back, not the front — that avoids overwriting values in <code>nums1</code> that haven't been read yet. Keep three pointers: the last real element of each array, and the last write slot; place the larger of the two candidates at the write slot each step.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(m + n) time, O(1) extra space.</p>",
  "codeLanguage": "java",
  "code": "public void merge(int[] nums1, int m, int[] nums2, int n) {\n    int i = m - 1, j = n - 1, k = m + n - 1;\n    while (j >= 0) {\n        nums1[k--] = (i >= 0 && nums1[i] > nums2[j]) ? nums1[i--] : nums2[j--];\n    }\n}"
},
{
  "id": "dsa-b6-08",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Arrays & Strings",
  "title": "Reverse String",
  "difficulty": "Junior",
  "tags": [
    "Two Pointers",
    "String",
    "Arrays & Strings"
  ],
  "question": "Reverse a character array in place.",
  "answer": "<p>Two pointers starting at each end, swapping and moving inward until they meet.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public void reverseString(char[] s) {\n    int left = 0;\n    int right = s.length - 1;\n    while (left < right) {\n        char tmp = s[left];\n        s[left] = s[right];\n        s[right] = tmp;\n        left++; right--;\n    }\n}"
},
{
  "id": "dsa-b6-09",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Arrays & Strings",
  "title": "Valid Palindrome",
  "difficulty": "Junior",
  "tags": [
    "Two Pointers",
    "String",
    "Arrays & Strings"
  ],
  "question": "Given a string, determine if it's a palindrome after converting to lowercase and removing all non-alphanumeric characters.",
  "answer": "<p>Two pointers from each end; skip past any non-alphanumeric character on either side, then compare characters case-insensitively. No need to build a cleaned copy of the string first.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public boolean isPalindrome(String s) {\n    int left = 0;\n    int right = s.length() - 1;\n    while (left < right) {\n        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;\n        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;\n        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) return false;\n        left++; right--;\n    }\n    return true;\n}"
},
{
  "id": "dsa-b6-10",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Arrays & Strings",
  "title": "Longest Common Prefix",
  "difficulty": "Junior",
  "tags": [
    "String",
    "Arrays & Strings"
  ],
  "question": "Find the longest common prefix string amongst an array of strings.",
  "answer": "<p>Take the first string as a candidate prefix and shrink it one character at a time from the end until every other string actually starts with it.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(S) time where S is the total character count across all strings.</p>",
  "codeLanguage": "java",
  "code": "public String longestCommonPrefix(String[] strs) {\n    if (strs.length == 0) return \"\";\n    String prefix = strs[0];\n    for (int i = 1; i < strs.length; i++) {\n        while (!strs[i].startsWith(prefix)) {\n            prefix = prefix.substring(0, prefix.length() - 1);\n            if (prefix.isEmpty()) return \"\";\n        }\n    }\n    return prefix;\n}"
},
{
  "id": "dsa-b6-11",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Arrays & Strings",
  "title": "First Unique Character in a String",
  "difficulty": "Junior",
  "tags": [
    "Hashing",
    "String",
    "Arrays & Strings"
  ],
  "question": "Find the index of the first non-repeating character in a string, or -1 if none exists.",
  "answer": "<p>Count every character's frequency in one pass, then scan the string a second time and return the index of the first character whose count is exactly 1.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public int firstUniqChar(String s) {\n    int[] counts = new int[26];\n    for (char c : s.toCharArray()) counts[c - 'a']++;\n    for (int i = 0; i < s.length(); i++) {\n        if (counts[s.charAt(i) - 'a'] == 1) return i;\n    }\n    return -1;\n}"
},
{
  "id": "dsa-b6-12",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Arrays & Strings",
  "title": "Roman to Integer",
  "difficulty": "Junior",
  "tags": [
    "String",
    "Math",
    "Arrays & Strings"
  ],
  "question": "Convert a Roman numeral string to an integer.",
  "answer": "<p>Map each symbol to its value and scan left to right. If a symbol's value is less than the value immediately to its right, it's a subtractive pair (like <code>IV</code>) — subtract it; otherwise add it.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public int romanToInt(String s) {\n    Map<Character, Integer> values = new HashMap<>();\n    values.put('I', 1); values.put('V', 5); values.put('X', 10);\n    values.put('L', 50); values.put('C', 100);\n    values.put('D', 500); values.put('M', 1000);\n\n    int total = 0;\n    for (int i = 0; i < s.length(); i++) {\n        int cur = values.get(s.charAt(i));\n        if (i + 1 < s.length() && cur < values.get(s.charAt(i + 1))) total -= cur;\n        else total += cur;\n    }\n    return total;\n}"
},
{
  "id": "dsa-b6-13",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Hashing & Two Pointers",
  "title": "Two Sum II — Input Array Is Sorted",
  "difficulty": "Junior",
  "tags": [
    "Two Pointers",
    "Sorted Array",
    "Hashing & Two Pointers"
  ],
  "question": "Given a sorted array, find two numbers that add up to a target, using O(1) extra space.",
  "answer": "<p>Because the array is sorted, two pointers from each end work: if the current sum is too small, move the left pointer right (increase the sum); if too large, move the right pointer left. This avoids the hash map used for the unsorted version entirely.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public int[] twoSum(int[] numbers, int target) {\n    int left = 0;\n    int right = numbers.length - 1;\n    while (left < right) {\n        int sum = numbers[left] + numbers[right];\n        if (sum == target) return new int[]{left + 1, right + 1};\n        else if (sum < target) left++;\n        else right--;\n    }\n    return new int[]{};\n}"
},
{
  "id": "dsa-b6-14",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Hashing & Two Pointers",
  "title": "Intersection of Two Arrays",
  "difficulty": "Junior",
  "tags": [
    "Hash Set",
    "Array",
    "Hashing & Two Pointers"
  ],
  "question": "Given two integer arrays, return their intersection — each element appearing once, in any order.",
  "answer": "<p>Put one array into a hash set, then walk the second array checking membership, collecting matches into a second set (to dedupe the output itself).</p><p class=\"mt-2\"><strong>Complexity:</strong> O(m + n) time, O(m + n) space.</p>",
  "codeLanguage": "java",
  "code": "public int[] intersection(int[] nums1, int[] nums2) {\n    Set<Integer> set1 = new HashSet<>();\n    for (int n : nums1) set1.add(n);\n\n    Set<Integer> result = new HashSet<>();\n    for (int n : nums2) {\n        if (set1.contains(n)) result.add(n);\n    }\n\n    int[] arr = new int[result.size()];\n    int idx = 0;\n    for (int n : result) arr[idx++] = n;\n    return arr;\n}"
},
{
  "id": "dsa-b6-15",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Hashing & Two Pointers",
  "title": "Single Number",
  "difficulty": "Junior",
  "tags": [
    "Bit Manipulation",
    "Hashing & Two Pointers"
  ],
  "question": "Given a non-empty array where every element appears twice except one, find that single element, in linear time and O(1) space.",
  "answer": "<p>XOR every element together. A value XORed with itself is 0, so every pair cancels out, leaving only the element that appears once. This is exactly why the O(1)-space constraint rules out a hash set here.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public int singleNumber(int[] nums) {\n    int result = 0;\n    for (int n : nums) result ^= n;\n    return result;\n}"
},
{
  "id": "dsa-b6-16",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Hashing & Two Pointers",
  "title": "Majority Element",
  "difficulty": "Junior",
  "tags": [
    "Boyer-Moore Voting",
    "Array",
    "Hashing & Two Pointers"
  ],
  "question": "Given an array where one element appears more than n/2 times, find that element.",
  "answer": "<p>Boyer-Moore voting: keep a candidate and a count. If count hits zero, pick a new candidate. Increment the count when the current element matches the candidate, decrement otherwise. The true majority element always survives this process.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public int majorityElement(int[] nums) {\n    int candidate = nums[0];\n    int count = 0;\n    for (int n : nums) {\n        if (count == 0) candidate = n;\n        count += (n == candidate) ? 1 : -1;\n    }\n    return candidate;\n}"
},
{
  "id": "dsa-b6-17",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Hashing & Two Pointers",
  "title": "Missing Number",
  "difficulty": "Junior",
  "tags": [
    "Math",
    "Array",
    "Hashing & Two Pointers"
  ],
  "question": "Given an array containing n distinct numbers from the range [0, n], find the one number missing from the range.",
  "answer": "<p>The sum of <code>0..n</code> has a closed form, <code>n * (n + 1) / 2</code>. Subtract the actual sum of the array from that expected sum — the difference is the missing number.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public int missingNumber(int[] nums) {\n    int n = nums.length;\n    int expectedSum = n * (n + 1) / 2;\n    int actualSum = 0;\n    for (int num : nums) actualSum += num;\n    return expectedSum - actualSum;\n}"
},
{
  "id": "dsa-b6-18",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Hashing & Two Pointers",
  "title": "Isomorphic Strings",
  "difficulty": "Junior",
  "tags": [
    "Hashing",
    "String",
    "Hashing & Two Pointers"
  ],
  "question": "Determine if two strings are isomorphic — characters in the first can be consistently replaced to get the second.",
  "answer": "<p>Maintain two maps, one for each direction (s→t and t→s). At every position, either both mappings agree with what's already recorded, or neither character has been mapped yet — anything else means the strings aren't isomorphic. Both directions matter: without the reverse map, two different source characters could both map to the same target character, which isn't a valid isomorphism.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space (fixed alphabet).</p>",
  "codeLanguage": "java",
  "code": "public boolean isIsomorphic(String s, String t) {\n    Map<Character, Character> mapST = new HashMap<>();\n    Map<Character, Character> mapTS = new HashMap<>();\n    for (int i = 0; i < s.length(); i++) {\n        char c1 = s.charAt(i);\n        char c2 = t.charAt(i);\n        if (mapST.containsKey(c1) && mapST.get(c1) != c2) return false;\n        if (mapTS.containsKey(c2) && mapTS.get(c2) != c1) return false;\n        mapST.put(c1, c2);\n        mapTS.put(c2, c1);\n    }\n    return true;\n}"
},
{
  "id": "dsa-b6-19",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Hashing & Two Pointers",
  "title": "Word Pattern",
  "difficulty": "Junior",
  "tags": [
    "Hashing",
    "String",
    "Hashing & Two Pointers"
  ],
  "question": "Given a pattern and a string of space-separated words, determine if the string follows the same bijective pattern.",
  "answer": "<p>Same bidirectional-mapping idea as Isomorphic Strings, just at word granularity instead of character granularity — split the string on spaces and map each pattern character to a word and back.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(n) space.</p>",
  "codeLanguage": "java",
  "code": "public boolean wordPattern(String pattern, String s) {\n    String[] words = s.split(\" \");\n    if (pattern.length() != words.length) return false;\n\n    Map<Character, String> charToWord = new HashMap<>();\n    Map<String, Character> wordToChar = new HashMap<>();\n    for (int i = 0; i < pattern.length(); i++) {\n        char c = pattern.charAt(i);\n        String w = words[i];\n        if (charToWord.containsKey(c) && !charToWord.get(c).equals(w)) return false;\n        if (wordToChar.containsKey(w) && wordToChar.get(w) != c) return false;\n        charToWord.put(c, w);\n        wordToChar.put(w, c);\n    }\n    return true;\n}"
},
{
  "id": "dsa-b6-20",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Hashing & Two Pointers",
  "title": "Ransom Note",
  "difficulty": "Junior",
  "tags": [
    "Hashing",
    "String",
    "Hashing & Two Pointers"
  ],
  "question": "Given two strings, ransomNote and magazine, determine if ransomNote can be constructed using the letters from magazine, each letter used at most once.",
  "answer": "<p>Count the letters available in <code>magazine</code>, then walk <code>ransomNote</code> decrementing counts — if any letter's count goes below zero (or was never available), the note can't be built.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(m + n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public boolean canConstruct(String ransomNote, String magazine) {\n    int[] counts = new int[26];\n    for (char c : magazine.toCharArray()) counts[c - 'a']++;\n    for (char c : ransomNote.toCharArray()) {\n        counts[c - 'a']--;\n        if (counts[c - 'a'] < 0) return false;\n    }\n    return true;\n}"
},
{
  "id": "dsa-b6-21",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Linked Lists",
  "title": "Reverse Linked List",
  "difficulty": "Junior",
  "tags": [
    "Linked List",
    "Linked Lists"
  ],
  "question": "Reverse a singly linked list, iteratively.",
  "answer": "<p>Walk the list once, at each node redirecting its <code>next</code> pointer to the previous node instead of the following one, tracking <code>prev</code> and <code>cur</code> as you go.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\n\npublic ListNode reverseList(ListNode head) {\n    ListNode prev = null;\n    ListNode cur = head;\n    while (cur != null) {\n        ListNode next = cur.next;\n        cur.next = prev;\n        prev = cur;\n        cur = next;\n    }\n    return prev;\n}"
},
{
  "id": "dsa-b6-22",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Linked Lists",
  "title": "Merge Two Sorted Lists",
  "difficulty": "Junior",
  "tags": [
    "Linked List",
    "Linked Lists"
  ],
  "question": "Merge two sorted linked lists into one sorted list by splicing the existing nodes together.",
  "answer": "<p>Use a dummy head node to avoid special-casing the first node. Repeatedly attach whichever of the two current nodes is smaller, then attach whatever's left of the non-exhausted list.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(m + n) time, O(1) extra space.</p>",
  "codeLanguage": "java",
  "code": "class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\n\npublic ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n    ListNode dummy = new ListNode(0);\n    ListNode tail = dummy;\n    while (l1 != null && l2 != null) {\n        if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }\n        else { tail.next = l2; l2 = l2.next; }\n        tail = tail.next;\n    }\n    tail.next = (l1 != null) ? l1 : l2;\n    return dummy.next;\n}"
},
{
  "id": "dsa-b6-23",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Linked Lists",
  "title": "Linked List Cycle",
  "difficulty": "Junior",
  "tags": [
    "Linked List",
    "Floyd's Cycle Detection",
    "Linked Lists"
  ],
  "question": "Determine whether a linked list contains a cycle.",
  "answer": "<p>Floyd's cycle detection: a slow pointer moves one node at a time, a fast pointer moves two. If there's a cycle, the fast pointer eventually laps the slow one and they meet; if the list terminates, fast simply reaches the end first.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\n\npublic boolean hasCycle(ListNode head) {\n    ListNode slow = head;\n    ListNode fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) return true;\n    }\n    return false;\n}"
},
{
  "id": "dsa-b6-24",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Linked Lists",
  "title": "Middle of the Linked List",
  "difficulty": "Junior",
  "tags": [
    "Linked List",
    "Two Pointers",
    "Linked Lists"
  ],
  "question": "Return the middle node of a singly linked list. If there are two middle nodes, return the second.",
  "answer": "<p>Same slow/fast two-pointer setup as cycle detection: when fast reaches the end (having moved twice as fast), slow is sitting exactly at the middle.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\n\npublic ListNode middleNode(ListNode head) {\n    ListNode slow = head;\n    ListNode fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n}"
},
{
  "id": "dsa-b6-25",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Linked Lists",
  "title": "Remove Duplicates from Sorted List",
  "difficulty": "Junior",
  "tags": [
    "Linked List",
    "Linked Lists"
  ],
  "question": "Given the head of a sorted linked list, delete all duplicates so each element appears only once.",
  "answer": "<p>Because the list is sorted, duplicates are always adjacent — walk the list, and whenever a node's value equals the next node's value, skip the next node instead of advancing onto it.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\n\npublic ListNode deleteDuplicates(ListNode head) {\n    ListNode cur = head;\n    while (cur != null && cur.next != null) {\n        if (cur.val == cur.next.val) cur.next = cur.next.next;\n        else cur = cur.next;\n    }\n    return head;\n}"
},
{
  "id": "dsa-b6-26",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Linked Lists",
  "title": "Palindrome Linked List",
  "difficulty": "Junior",
  "tags": [
    "Linked List",
    "Two Pointers",
    "Linked Lists"
  ],
  "question": "Determine if a singly linked list reads the same forwards and backwards.",
  "answer": "<p>Find the middle with slow/fast pointers, reverse the second half in place, then compare it against the first half node by node. No extra array needed to hold the values.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) extra space.</p>",
  "codeLanguage": "java",
  "code": "class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\n\npublic boolean isPalindrome(ListNode head) {\n    ListNode slow = head;\n    ListNode fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n\n    ListNode prev = null;\n    ListNode cur = slow;\n    while (cur != null) {\n        ListNode next = cur.next;\n        cur.next = prev;\n        prev = cur;\n        cur = next;\n    }\n\n    ListNode p1 = head;\n    ListNode p2 = prev;\n    while (p2 != null) {\n        if (p1.val != p2.val) return false;\n        p1 = p1.next;\n        p2 = p2.next;\n    }\n    return true;\n}"
},
{
  "id": "dsa-b6-27",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Linked Lists",
  "title": "Remove Linked List Elements",
  "difficulty": "Junior",
  "tags": [
    "Linked List",
    "Linked Lists"
  ],
  "question": "Remove every node from a linked list whose value equals a given target.",
  "answer": "<p>A dummy node before the head avoids special-casing the case where the head itself needs removing. Walk with a pointer that always looks one node ahead, skipping any node that matches.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\n\npublic ListNode removeElements(ListNode head, int val) {\n    ListNode dummy = new ListNode(0);\n    dummy.next = head;\n    ListNode cur = dummy;\n    while (cur.next != null) {\n        if (cur.next.val == val) cur.next = cur.next.next;\n        else cur = cur.next;\n    }\n    return dummy.next;\n}"
},
{
  "id": "dsa-b6-28",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Linked Lists",
  "title": "Intersection of Two Linked Lists",
  "difficulty": "Junior",
  "tags": [
    "Linked List",
    "Two Pointers",
    "Linked Lists"
  ],
  "question": "Given the heads of two singly linked lists, find the node at which they intersect, or null if they don't.",
  "answer": "<p>An elegant O(1)-space trick: walk both lists with two pointers, and when a pointer reaches the end of its list, redirect it to the head of the <em>other</em> list. Both pointers then travel the same total distance (lengthA + lengthB), so they arrive at the intersection point at the same step — or both hit null together if there's no intersection.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(m + n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\n\npublic ListNode getIntersectionNode(ListNode headA, ListNode headB) {\n    ListNode pA = headA;\n    ListNode pB = headB;\n    while (pA != pB) {\n        pA = (pA == null) ? headB : pA.next;\n        pB = (pB == null) ? headA : pB.next;\n    }\n    return pA;\n}"
},
{
  "id": "dsa-b6-29",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Stacks, Queues & Trees",
  "title": "Valid Parentheses",
  "difficulty": "Junior",
  "tags": [
    "Stack",
    "String",
    "Stacks, Queues & Trees"
  ],
  "question": "Given a string containing just '()[]{}', determine if the brackets are validly matched and nested.",
  "answer": "<p>Push every opening bracket onto a stack. On a closing bracket, the top of the stack must be its matching opener — pop it if so, otherwise the string is invalid. At the end, the stack must be empty.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(n) space.</p>",
  "codeLanguage": "java",
  "code": "public boolean isValid(String s) {\n    Deque<Character> stack = new ArrayDeque<>();\n    Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');\n    for (char c : s.toCharArray()) {\n        if (c == '(' || c == '[' || c == '{') {\n            stack.push(c);\n        } else {\n            if (stack.isEmpty() || stack.pop() != pairs.get(c)) return false;\n        }\n    }\n    return stack.isEmpty();\n}"
},
{
  "id": "dsa-b6-30",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Stacks, Queues & Trees",
  "title": "Min Stack",
  "difficulty": "Junior",
  "tags": [
    "Stack",
    "Design",
    "Stacks, Queues & Trees"
  ],
  "question": "Design a stack that supports push, pop, top, and retrieving the minimum element, all in O(1).",
  "answer": "<p>Keep a second stack alongside the main one, where each entry is the minimum seen so far <em>including</em> the value just pushed onto the main stack. Popping both stacks together keeps the minimum always correct with no rescanning.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(1) time for every operation, O(n) space.</p>",
  "codeLanguage": "java",
  "code": "class MinStack {\n    private Deque<Integer> stack = new ArrayDeque<>();\n    private Deque<Integer> minStack = new ArrayDeque<>();\n\n    public void push(int value) {\n        stack.push(value);\n        minStack.push(minStack.isEmpty() ? value : Math.min(value, minStack.peek()));\n    }\n\n    public void pop() { stack.pop(); minStack.pop(); }\n    public int top() { return stack.peek(); }\n    public int getMin() { return minStack.peek(); }\n}"
},
{
  "id": "dsa-b6-31",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Stacks, Queues & Trees",
  "title": "Implement Queue using Stacks",
  "difficulty": "Junior",
  "tags": [
    "Stack",
    "Queue",
    "Design",
    "Stacks, Queues & Trees"
  ],
  "question": "Implement a FIFO queue using only two stacks.",
  "answer": "<p>Push always goes onto <code>inStack</code>. For pop/peek, if <code>outStack</code> is empty, drain everything from <code>inStack</code> into it — that drain reverses the order, turning stack order back into queue order. Each element only gets moved once across its lifetime, which is what keeps this amortized O(1).</p><p class=\"mt-2\"><strong>Complexity:</strong> Amortized O(1) per operation.</p>",
  "codeLanguage": "java",
  "code": "class MyQueue {\n    private Deque<Integer> inStack = new ArrayDeque<>();\n    private Deque<Integer> outStack = new ArrayDeque<>();\n\n    public void push(int x) { inStack.push(x); }\n\n    private void shift() {\n        if (outStack.isEmpty()) {\n            while (!inStack.isEmpty()) outStack.push(inStack.pop());\n        }\n    }\n\n    public int pop() { shift(); return outStack.pop(); }\n    public int peek() { shift(); return outStack.peek(); }\n    public boolean empty() { return inStack.isEmpty() && outStack.isEmpty(); }\n}"
},
{
  "id": "dsa-b6-32",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Stacks, Queues & Trees",
  "title": "Implement Stack using Queues",
  "difficulty": "Junior",
  "tags": [
    "Stack",
    "Queue",
    "Design",
    "Stacks, Queues & Trees"
  ],
  "question": "Implement a LIFO stack using only queues.",
  "answer": "<p>Use a single queue. On push, add the new element, then rotate the queue (size − 1) times — dequeue and immediately re-enqueue each existing element — which walks the new element all the way to the front, making it the next to come out.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) per push, O(1) per pop/top.</p>",
  "codeLanguage": "java",
  "code": "class MyStack {\n    private Queue<Integer> queue = new LinkedList<>();\n\n    public void push(int x) {\n        queue.add(x);\n        int size = queue.size();\n        for (int i = 0; i < size - 1; i++) {\n            queue.add(queue.poll());\n        }\n    }\n\n    public int pop() { return queue.poll(); }\n    public int top() { return queue.peek(); }\n    public boolean empty() { return queue.isEmpty(); }\n}"
},
{
  "id": "dsa-b6-33",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Stacks, Queues & Trees",
  "title": "Maximum Depth of Binary Tree",
  "difficulty": "Junior",
  "tags": [
    "Tree",
    "Recursion",
    "DFS",
    "Stacks, Queues & Trees"
  ],
  "question": "Find the maximum depth (number of nodes along the longest root-to-leaf path) of a binary tree.",
  "answer": "<p>A tree's depth is 1 plus the deeper of its two subtrees' depths — a direct recursive definition, with an empty tree having depth 0 as the base case.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(h) space for the recursion stack (h = height).</p>",
  "codeLanguage": "java",
  "code": "class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}\n\npublic int maxDepth(TreeNode root) {\n    if (root == null) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}"
},
{
  "id": "dsa-b6-34",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Stacks, Queues & Trees",
  "title": "Invert Binary Tree",
  "difficulty": "Junior",
  "tags": [
    "Tree",
    "Recursion",
    "Stacks, Queues & Trees"
  ],
  "question": "Invert a binary tree — every node's left and right children swap places.",
  "answer": "<p>Recursively invert both subtrees first, then swap the (now-inverted) left and right children at the current node.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(h) space.</p>",
  "codeLanguage": "java",
  "code": "class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}\n\npublic TreeNode invertTree(TreeNode root) {\n    if (root == null) return null;\n    TreeNode left = invertTree(root.left);\n    TreeNode right = invertTree(root.right);\n    root.left = right;\n    root.right = left;\n    return root;\n}"
},
{
  "id": "dsa-b6-35",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Stacks, Queues & Trees",
  "title": "Same Tree",
  "difficulty": "Junior",
  "tags": [
    "Tree",
    "Recursion",
    "DFS",
    "Stacks, Queues & Trees"
  ],
  "question": "Given two binary trees, determine if they are structurally identical with the same node values.",
  "answer": "<p>Recursively compare: both null is equal; one null and the other isn't is unequal; different values at the current node is unequal; otherwise recurse into both left and right subtree pairs.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(h) space.</p>",
  "codeLanguage": "java",
  "code": "class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}\n\npublic boolean isSameTree(TreeNode p, TreeNode q) {\n    if (p == null && q == null) return true;\n    if (p == null || q == null || p.val != q.val) return false;\n    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n}"
},
{
  "id": "dsa-b6-36",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Stacks, Queues & Trees",
  "title": "Symmetric Tree",
  "difficulty": "Junior",
  "tags": [
    "Tree",
    "Recursion",
    "Stacks, Queues & Trees"
  ],
  "question": "Check whether a binary tree is a mirror image of itself around its center.",
  "answer": "<p>Symmetry means the left subtree mirrors the right subtree: their outer values must match (left.left vs right.right) and their inner values must match (left.right vs right.left), recursively.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(h) space.</p>",
  "codeLanguage": "java",
  "code": "class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}\n\npublic boolean isSymmetric(TreeNode root) {\n    return isMirror(root == null ? null : root.left, root == null ? null : root.right);\n}\n\nprivate boolean isMirror(TreeNode a, TreeNode b) {\n    if (a == null && b == null) return true;\n    if (a == null || b == null || a.val != b.val) return false;\n    return isMirror(a.left, b.right) && isMirror(a.right, b.left);\n}"
},
{
  "id": "dsa-b6-37",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Stacks, Queues & Trees",
  "title": "Path Sum",
  "difficulty": "Junior",
  "tags": [
    "Tree",
    "Recursion",
    "DFS",
    "Stacks, Queues & Trees"
  ],
  "question": "Determine if a binary tree has a root-to-leaf path whose values sum to a given target.",
  "answer": "<p>Recurse down, subtracting the current node's value from the remaining target at each step. At a leaf, check whether the remaining target has been reduced to exactly zero.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(h) space.</p>",
  "codeLanguage": "java",
  "code": "class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}\n\npublic boolean hasPathSum(TreeNode root, int targetSum) {\n    if (root == null) return false;\n    if (root.left == null && root.right == null) return targetSum == root.val;\n    int remaining = targetSum - root.val;\n    return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);\n}"
},
{
  "id": "dsa-b6-38",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Stacks, Queues & Trees",
  "title": "Binary Tree Inorder Traversal",
  "difficulty": "Junior",
  "tags": [
    "Tree",
    "Stack",
    "DFS",
    "Stacks, Queues & Trees"
  ],
  "question": "Return the inorder traversal (left, node, right) of a binary tree's values, iteratively.",
  "answer": "<p>Use an explicit stack to simulate the recursion: push the entire left chain first, then pop, visit, and move to the right child, repeating.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(h) space.</p>",
  "codeLanguage": "java",
  "code": "class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}\n\npublic List<Integer> inorderTraversal(TreeNode root) {\n    List<Integer> result = new ArrayList<>();\n    Deque<TreeNode> stack = new ArrayDeque<>();\n    TreeNode cur = root;\n    while (cur != null || !stack.isEmpty()) {\n        while (cur != null) { stack.push(cur); cur = cur.left; }\n        cur = stack.pop();\n        result.add(cur.val);\n        cur = cur.right;\n    }\n    return result;\n}"
},
{
  "id": "dsa-b6-39",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Stacks, Queues & Trees",
  "title": "Balanced Binary Tree",
  "difficulty": "Junior",
  "tags": [
    "Tree",
    "Recursion",
    "DFS",
    "Stacks, Queues & Trees"
  ],
  "question": "Determine if a binary tree is height-balanced — the depths of every node's two subtrees never differ by more than one.",
  "answer": "<p>A naive version recomputes height at every node, giving O(n²). The optimized version returns height and -1 (as a sentinel for \"already unbalanced\") from the same recursive call, short-circuiting as soon as imbalance is found anywhere below.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(h) space.</p>",
  "codeLanguage": "java",
  "code": "class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}\n\npublic boolean isBalanced(TreeNode root) {\n    return height(root) != -1;\n}\n\nprivate int height(TreeNode node) {\n    if (node == null) return 0;\n    int left = height(node.left);\n    if (left == -1) return -1;\n    int right = height(node.right);\n    if (right == -1) return -1;\n    if (Math.abs(left - right) > 1) return -1;\n    return 1 + Math.max(left, right);\n}"
},
{
  "id": "dsa-b6-40",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Stacks, Queues & Trees",
  "title": "Minimum Depth of Binary Tree",
  "difficulty": "Junior",
  "tags": [
    "Tree",
    "Recursion",
    "BFS",
    "Stacks, Queues & Trees"
  ],
  "question": "Find the minimum depth of a binary tree — the shortest root-to-leaf path.",
  "answer": "<p>Careful with this one: a node with only one child isn't a valid \"short path\" — you must continue down the non-null side. Only take the min of both subtrees' depths when both children actually exist.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(h) space.</p>",
  "codeLanguage": "java",
  "code": "class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}\n\npublic int minDepth(TreeNode root) {\n    if (root == null) return 0;\n    if (root.left == null) return 1 + minDepth(root.right);\n    if (root.right == null) return 1 + minDepth(root.left);\n    return 1 + Math.min(minDepth(root.left), minDepth(root.right));\n}"
},
{
  "id": "dsa-b6-41",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Recursion, DP & Math",
  "title": "Climbing Stairs",
  "difficulty": "Junior",
  "tags": [
    "Dynamic Programming",
    "Recursion, DP & Math"
  ],
  "question": "You can climb 1 or 2 steps at a time. Given n steps, how many distinct ways are there to reach the top?",
  "answer": "<p>The number of ways to reach step n is the sum of the ways to reach step n-1 (then take one step) and step n-2 (then take two steps) — the Fibonacci recurrence in disguise. Build it bottom-up with two rolling variables instead of recursing (which would recompute the same subproblems exponentially many times).</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}"
},
{
  "id": "dsa-b6-42",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Recursion, DP & Math",
  "title": "Fibonacci Number",
  "difficulty": "Junior",
  "tags": [
    "Dynamic Programming",
    "Recursion",
    "Recursion, DP & Math"
  ],
  "question": "Compute the nth Fibonacci number, where F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).",
  "answer": "<p>The naive recursive definition recomputes the same values exponentially many times. Build it iteratively bottom-up instead, keeping just the last two values.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public int fib(int n) {\n    if (n < 2) return n;\n    int a = 0, b = 1;\n    for (int i = 0; i < n - 1; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}"
},
{
  "id": "dsa-b6-43",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Recursion, DP & Math",
  "title": "Pascal's Triangle",
  "difficulty": "Junior",
  "tags": [
    "Array",
    "Dynamic Programming",
    "Recursion, DP & Math"
  ],
  "question": "Generate the first numRows rows of Pascal's triangle.",
  "answer": "<p>Each row starts and ends with 1; every interior value is the sum of the two values above it from the previous row. Build row by row from the previous one.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(numRows²) time and space.</p>",
  "codeLanguage": "java",
  "code": "public List<List<Integer>> generate(int numRows) {\n    List<List<Integer>> triangle = new ArrayList<>();\n    for (int i = 0; i < numRows; i++) {\n        List<Integer> row = new ArrayList<>(Collections.nCopies(i + 1, 1));\n        for (int j = 1; j < i; j++) {\n            row.set(j, triangle.get(i - 1).get(j - 1) + triangle.get(i - 1).get(j));\n        }\n        triangle.add(row);\n    }\n    return triangle;\n}"
},
{
  "id": "dsa-b6-44",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Recursion, DP & Math",
  "title": "Power of Two",
  "difficulty": "Junior",
  "tags": [
    "Bit Manipulation",
    "Math",
    "Recursion, DP & Math"
  ],
  "question": "Given an integer, determine if it is a power of two.",
  "answer": "<p>A power of two has exactly one bit set in binary. <code>n & (n - 1)</code> clears the lowest set bit — for a power of two, that leaves zero. Must also guard against non-positive n, since the bit trick alone would incorrectly accept 0.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(1) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public boolean isPowerOfTwo(int n) {\n    return n > 0 && (n & (n - 1)) == 0;\n}"
},
{
  "id": "dsa-b6-45",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Recursion, DP & Math",
  "title": "Happy Number",
  "difficulty": "Junior",
  "tags": [
    "Hashing",
    "Math",
    "Cycle Detection",
    "Recursion, DP & Math"
  ],
  "question": "A number is happy if repeatedly replacing it with the sum of the squares of its digits eventually reaches 1. Determine if a given number is happy.",
  "answer": "<p>If a number isn't happy, this process always enters a cycle instead of diverging (the sum of squares of digits is bounded, so the sequence of values is bounded too). Track visited values in a hash set; if a value repeats before reaching 1, it's not happy.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(log n) per step, bounded number of steps before a cycle or 1.</p>",
  "codeLanguage": "java",
  "code": "public boolean isHappy(int n) {\n    Set<Integer> seen = new HashSet<>();\n    int num = n;\n    while (num != 1 && seen.add(num)) {\n        num = sumOfSquaredDigits(num);\n    }\n    return num == 1;\n}\n\nprivate int sumOfSquaredDigits(int n) {\n    int sum = 0;\n    while (n > 0) {\n        int digit = n % 10;\n        sum += digit * digit;\n        n /= 10;\n    }\n    return sum;\n}"
},
{
  "id": "dsa-b6-46",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Recursion, DP & Math",
  "title": "Count Primes",
  "difficulty": "Junior",
  "tags": [
    "Math",
    "Sieve of Eratosthenes",
    "Recursion, DP & Math"
  ],
  "question": "Count the number of prime numbers strictly less than n.",
  "answer": "<p>The Sieve of Eratosthenes: starting from 2, mark every multiple of each unmarked number as composite. Only need to sieve starting multiples from i*i (anything smaller was already marked by a smaller factor), and only up to √n.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n log log n) time, O(n) space.</p>",
  "codeLanguage": "java",
  "code": "public int countPrimes(int n) {\n    if (n < 3) return 0;\n    boolean[] isComposite = new boolean[n];\n    int count = 0;\n    for (int i = 2; i < n; i++) {\n        if (!isComposite[i]) {\n            count++;\n            for (long multiple = (long) i * i; multiple < n; multiple += i) {\n                isComposite[(int) multiple] = true;\n            }\n        }\n    }\n    return count;\n}"
},
{
  "id": "dsa-b6-47",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Recursion, DP & Math",
  "title": "Reverse Integer",
  "difficulty": "Junior",
  "tags": [
    "Math",
    "Recursion, DP & Math"
  ],
  "question": "Reverse the digits of a signed 32-bit integer. Return 0 if the reversed value overflows a 32-bit int.",
  "answer": "<p>Peel off digits one at a time from the end and build the reversed number, checking before each multiply-and-add whether the result would overflow <code>Integer.MAX_VALUE</code>/<code>Integer.MIN_VALUE</code> — checking after the fact is too late, since the overflow itself is undefined-ish behavior to rely on.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(log n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public int reverse(int x) {\n    int result = 0;\n    while (x != 0) {\n        int digit = x % 10;\n        x /= 10;\n        if (result > Integer.MAX_VALUE / 10 || result < Integer.MIN_VALUE / 10) return 0;\n        result = result * 10 + digit;\n    }\n    return result;\n}"
},
{
  "id": "dsa-b6-48",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Recursion, DP & Math",
  "title": "Palindrome Number",
  "difficulty": "Junior",
  "tags": [
    "Math",
    "Recursion, DP & Math"
  ],
  "question": "Determine if an integer is a palindrome without converting it to a string.",
  "answer": "<p>Negative numbers are never palindromes. Reverse only the second half of the number by peeling digits off the original while building up a reverted number, stopping once the reverted half is at least as large as what remains — that naturally lands you at the midpoint, handling both even and odd digit counts.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(log n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public boolean isPalindrome(int x) {\n    if (x < 0 || (x % 10 == 0 && x != 0)) return false;\n    int reverted = 0;\n    while (x > reverted) {\n        reverted = reverted * 10 + x % 10;\n        x /= 10;\n    }\n    return x == reverted || x == reverted / 10;\n}"
},
{
  "id": "dsa-b6-49",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Recursion, DP & Math",
  "title": "Excel Sheet Column Number",
  "difficulty": "Junior",
  "tags": [
    "Math",
    "String",
    "Recursion, DP & Math"
  ],
  "question": "Given a spreadsheet column title like 'A', 'B', ..., 'AB', 'AC', ..., return its corresponding column number.",
  "answer": "<p>This is base-26 conversion, treating 'A' as digit 1 (not 0) — process left to right, multiplying the running total by 26 and adding the value of the next letter each step, same shape as converting a base-10 string to an integer.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(1) space.</p>",
  "codeLanguage": "java",
  "code": "public int titleToNumber(String columnTitle) {\n    int result = 0;\n    for (char c : columnTitle.toCharArray()) {\n        result = result * 26 + (c - 'A' + 1);\n    }\n    return result;\n}"
},
{
  "id": "dsa-b6-50",
  "category": "dsa",
  "categoryName": "DSA",
  "topic": "Recursion, DP & Math",
  "title": "Plus One",
  "difficulty": "Junior",
  "tags": [
    "Array",
    "Math",
    "Recursion, DP & Math"
  ],
  "question": "Given a large integer represented as an array of digits, add one to it and return the resulting digit array.",
  "answer": "<p>Add 1 starting from the last digit and propagate the carry leftward. If a digit is less than 9, incrementing it stops the carry immediately. If every digit was a 9 (all carried), the array grows by one digit with a leading 1.</p><p class=\"mt-2\"><strong>Complexity:</strong> O(n) time, O(n) worst-case space for the carry-over.</p>",
  "codeLanguage": "java",
  "code": "public int[] plusOne(int[] digits) {\n    for (int i = digits.length - 1; i >= 0; i--) {\n        if (digits[i] < 9) {\n            digits[i]++;\n            return digits;\n        }\n        digits[i] = 0;\n    }\n    int[] result = new int[digits.length + 1];\n    result[0] = 1;\n    return result;\n}"
}
);
