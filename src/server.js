// src/server.js
require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const { getAuthenticatedOctokit, getPullRequestDiff, postReviewComment } = require('./github');
const { parseDiff } = require('./parser');
const { reviewCode } = require('./ai');

const app = express();
const port = process.env.PORT || 3000;
const webhookSecret = process.env.WEBHOOK_SECRET;

// Middleware to get raw body for webhook verification
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

app.get('/', (req, res) => {
    res.send('GitHub Code Reviewer is alive!');
});

// Function to verify webhook signature
function verifyWebhookSignature(req) {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        return false;
    }
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

app.post('/webhook', async (req, res) => {
    if (!verifyWebhookSignature(req)) {
        console.log('Webhook signature verification failed.');
        return res.status(401).send('Webhook signature verification failed.');
    }

    console.log('Webhook received and verified!');
    
    const githubEvent = req.headers['x-github-event'];

    if (githubEvent === 'pull_request') {
        const action = req.body.action;
        console.log(`Pull request action: ${action}`);

        if (action === 'opened' || action === 'synchronize') {
            const installationId = req.body.installation.id;
            const owner = req.body.repository.owner.login;
            const repo = req.body.repository.name;
            const pull_number = req.body.pull_request.number;
            const commit_id = req.body.pull_request.head.sha;

            try {
                const octokit = await getAuthenticatedOctokit(installationId);
                const diff = await getPullRequestDiff(owner, repo, pull_number, octokit);
                const changedFiles = parseDiff(diff);

                for (const file of changedFiles) {
                    for (const line of file.addedLines) {
                        const review = await reviewCode(line.content);
                        await postReviewComment(owner, repo, pull_number, octokit, review, file.fileName, line.lineNumber);
                    }
                }

            } catch (error) {
                console.error('Error handling pull request event:', error);
            }
        }
    }

    res.status(200).send('Webhook received');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
