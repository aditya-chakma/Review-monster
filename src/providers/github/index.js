// src/providers/github/index.js

const { getAuthenticatedOctokit, getPullRequestDiff, postReviewComment } = require('./client');
const { performReview } = require('../../core/review');

async function handleWebhook(payload) {
    const action = payload.action;
    console.log(`GitHub Pull request action: ${action}`);

    if (action === 'opened' || action === 'synchronize') {
        const installationId = payload.installation.id;
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;
        const pull_number = payload.pull_request.number;
        const commit_id = payload.pull_request.head.sha;

        console.log(`Starting review for PR #${pull_number} in ${owner}/${repo}`);

        const pullRequestDetails = {
            installationId,
            owner,
            repo,
            pull_number,
            commit_id,
        };

        const provider_functions = {
            getAuthenticatedClient: () => getAuthenticatedOctokit(installationId),
            getDiff: (octokit) => getPullRequestDiff(owner, repo, pull_number, octokit),
            postComment: (octokit, body, path, line) => postReviewComment(owner, repo, pull_number, octokit, body, path, line)
        }

        await performReview(pullRequestDetails, provider_functions);
    }
}

module.exports = {
    handleWebhook,
};
