// src/github.js
require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const appId = process.env.GITHUB_APP_ID;
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');

function generateJwt() {
    const payload = {
        iat: Math.floor(Date.now() / 1000) - 60,
        exp: Math.floor(Date.now() / 1000) + (10 * 60),
        iss: appId,
    };
    return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

async function getAuthenticatedOctokit(installationId) {
    const appOctokit = new Octokit({
        auth: generateJwt(),
    });

    const { data: { token } } = await appOctokit.apps.createInstallationAccessToken({
        installation_id: installationId,
    });

    return new Octokit({
        auth: token,
    });
}

async function getPullRequestDiff(owner, repo, pull_number, octokit) {
    const { data: diff } = await octokit.pulls.get({
        owner,
        repo,
        pull_number,
        mediaType: {
            format: 'diff'
        }
    });
    return diff;
}

async function postReviewComment(owner, repo, pull_number, octokit, body, path, line) {
    await octokit.pulls.createReviewComment({
        owner,
        repo,
        pull_number,
        body,
        path,
        line,
    });
}

module.exports = {
    getPullRequestDiff,
    getAuthenticatedOctokit,
    postReviewComment
};
