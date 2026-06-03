// src/server.js
require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const githubAdapter = require('./providers/github');

const app = express();
const port = process.env.PORT || 3000;
const webhookSecret = process.env.WEBHOOK_SECRET;

app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

app.get('/', (req, res) => {
    res.send('GitHub Code Reviewer is alive!');
});

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
    // 1. Verify the signature to ensure the webhook is from GitHub
    if (!verifyWebhookSignature(req)) {
        console.log('Webhook signature verification failed.');
        return res.status(401).send('Webhook signature verification failed.');
    }

    // 2. Detect the provider (hard-coded to GitHub for now)
    const provider = 'github'; // In the future, you would detect this from headers

    console.log('Webhook received and verified!');
    
    // 3. Route to the appropriate adapter
    if (provider === 'github' && req.headers['x-github-event'] === 'pull_request') {
        try {
            // Asynchronously handle the webhook
            githubAdapter.handleWebhook(req.body);
        } catch (error) {
            console.error('Error handling pull request event:', error);
        }
    }

    // Respond immediately to GitHub
    res.status(202).send('Webhook accepted for processing');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
