// src/core/parser.js
function parseDiff(diff) {
    const files = diff.split('diff --git');
    const changedFiles = [];

    for (const file of files) {
        if (!file) continue;

        const lines = file.split('\n');
        const fileNameLine = lines.find(line => line.startsWith('+++ b/'));
        if (!fileNameLine) continue;

        const fileName = fileNameLine.substring(6);
        const addedLines = [];
        let lineNumber = 0;

        for (const line of lines) {
            if (line.startsWith('@@')) {
                const match = line.match(/@@ -\d+(,\d+)? \+(\d+)(,\d+)? @@/);
                if (match) {
                    lineNumber = parseInt(match[2], 10);
                }
            } else if (line.startsWith('+') && !line.startsWith('+++')) {
                addedLines.push({
                    content: line.substring(1),
                    lineNumber: lineNumber,
                });
                lineNumber++;
            } else if (!line.startsWith('-') && !line.startsWith('---')) {
                lineNumber++;
            }
        }
        changedFiles.push({
            fileName,
            addedLines,
        });
    }

    return changedFiles;
}

module.exports = {
    parseDiff,
};
