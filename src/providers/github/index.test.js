// src/providers/github/index.test.js

const { handleWebhook } = require('./index');
const { performReview } = require('../../core/review');

// Mock the core review module
jest.mock('../../core/review', () => ({
    performReview: jest.fn(),
}));

// Sample GitHub webhook payload for a pull request
const pullRequestOpenedPayload = {
    action: 'opened',
    installation: {
        id: 12345,
    },
    repository: {
        name: 'test-repo',
        owner: {
            login: 'test-owner',
        },
    },
    pull_request: {
        number: 42,
        head: {
            sha: 'abcdef123456',
        },
    },
};

describe('GitHub Provider', () => {
    // Clear mock history before each test
    beforeEach(() => {
        performReview.mockClear();
    });

    it('should call performReview when a pull request is opened', async () => {
        await handleWebhook(pullRequestOpenedPayload);

        // Expect performReview to have been called once
        expect(performReview).toHaveBeenCalledTimes(1);

        // Check the arguments passed to performReview
        const expectedDetails = {
            installationId: 12345,
            owner: 'test-owner',
            repo: 'test-repo',
            pull_number: 42,
            commit_id: 'abcdef123456',
        };
        
        // The second argument contains functions, so we check if they are defined
        expect(performReview).toHaveBeenCalledWith(
            expectedDetails,
            expect.objectContaining({
                getAuthenticatedClient: expect.any(Function),
                getDiff: expect.any(Function),
                postComment: expect.any(Function),
            })
        );
    });

    it('should not call performReview for non-PR events or other actions', async () => {
        const wrongActionPayload = { ...pullRequestOpenedPayload, action: 'closed' };
        await handleWebhook(wrongActionPayload);
        
        expect(performReview).not.toHaveBeenCalled();
    });
});
