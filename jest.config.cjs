// jest.config.cjs
module.exports = {
    testEnvironment: 'node',
    verbose: true,
    transformIgnorePatterns: [
        '/node_modules/(?!(@octokit|octokit-.*|@sindresorhus.*|universal-user-agent|before-after-hook)/)',
    ],
};
