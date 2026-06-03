// src/core/review.js
const { parseDiff } = require('./parser');
const { reviewCode } = require('./ai');

async function performReview(pullRequestDetails, provider) {
    console.log('Performing review with core logic...');
    try {
        const client = await provider.getAuthenticatedClient();
        const diff = await provider.getDiff(client);
        const changedFiles = parseDiff(diff);

        console.log('Changed Files:', JSON.stringify(changedFiles, null, 2));

        for (const file of changedFiles) {
            if (file.addedLines.length === 0) continue;

            console.log(`Reviewing ${file.addedLines.length} added lines in ${file.fileName}...`);

            for (const line of file.addedLines) {
                const review = await reviewCode(line.content);
                await provider.postComment(client, review, file.fileName, line.lineNumber);
                console.log(`Posted comment for line ${line.lineNumber} in ${file.fileName}`);
            }
        }
        console.log('Review finished.');
    } catch (error) {
        console.error('Error during the review process:', error);
    }
}

module.exports = {
    performReview,
};
