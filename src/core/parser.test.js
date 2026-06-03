// src/core/parser.test.js
const { parseDiff } = require('./parser');

const sampleDiff = `diff --git a/file1.js b/file1.js
index 1234567..abcdefg 100644
--- a/file1.js
+++ b/file1.js
@@ -1,5 +1,6 @@
 console.log("hello");
-console.log("world");
+console.log("world!");
+console.log("new line");
 console.log("another line");
 
 function oldFunction() {
diff --git a/file2.js b/file2.js
index 1234567..abcdefg 100644
--- a/file2.js
+++ b/file2.js
@@ -10,3 +10,4 @@
 function existingFunction() {
   // no change
 }
+ // a new comment`;

describe('parseDiff', () => {
    it('should parse a diff and extract added lines', () => {
        const changedFiles = parseDiff(sampleDiff);

        // Check file1.js
        expect(changedFiles).toHaveLength(2);
        expect(changedFiles[0].fileName).toBe('file1.js');
        expect(changedFiles[0].addedLines).toHaveLength(2);
        expect(changedFiles[0].addedLines[0]).toEqual({
            content: 'console.log("world!");',
            lineNumber: 2,
        });
        expect(changedFiles[0].addedLines[1]).toEqual({
            content: 'console.log("new line");',
            lineNumber: 3,
        });

        // Check file2.js
        expect(changedFiles[1].fileName).toBe('file2.js');
        expect(changedFiles[1].addedLines).toHaveLength(1);
        expect(changedFiles[1].addedLines[0]).toEqual({
            content: ' // a new comment',
            lineNumber: 13,
        });
    });

    it('should return an empty array for an empty diff', () => {
        const changedFiles = parseDiff('');
        expect(changedFiles).toEqual([]);
    });
});
