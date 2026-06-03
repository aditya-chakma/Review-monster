# GitHub Inline Code Reviewer

This document outlines the plan and architecture for building a GitHub-integrated inline code reviewer.

## High-Level Architecture

The application will be a Node.js server that listens for GitHub webhooks. When a pull request is created or updated, the server will:

1.  **Receive a webhook from GitHub:** A webhook will be triggered by GitHub for pull request events.
2.  **Fetch PR details:** The server will use the GitHub API to fetch the details of the pull request, including the changed files.
3.  **Analyze the diff:** The application will parse the diff of the changed files to identify the added or modified code.
4.  **Send code to AI for review:** The relevant code snippets will be sent to an AI model for review.
5.  **Post comments on GitHub:** The AI's review comments will be formatted and posted as inline comments on the pull request.

## Step-by-Step Guide

Here's a breakdown of the steps to build this application:

### 1. Set up a GitHub App

*   **Create a GitHub App:** Go to your GitHub settings and create a new GitHub App.
*   **Permissions:** Grant the app the necessary permissions. It will need `Pull request: Read & Write` permissions to read pull requests and post comments.
*   **Webhooks:** Configure a webhook URL. This URL will point to the server you'll create. Subscribe to the "Pull request" event.
*   **Private Key:** Generate a private key for your app. This will be used to authenticate as the app.

### 2. Build the Server

*   **Framework:** We'll use a simple and lightweight web framework like Express.js to create the server.
*   **Webhook Handler:** Create an endpoint that will receive the webhook events from GitHub. This endpoint will parse the event payload.
*   **Authentication:** Implement the logic to authenticate as the GitHub App using the private key. The `jsonwebtoken` library can be used for this.

### 3. Interact with the GitHub API

*   **Library:** Use a library like `@octokit/rest` to simplify interactions with the GitHub API.
*   **Fetch Diff:** When a pull request event is received, use the GitHub API to get the diff for the pull request.
*   **Post Comments:** After getting the review from the AI, use the GitHub API to create inline comments on the pull request.

### 4. Integrate with an AI Model

*   **API:** Choose an AI model and get an API key.
*   **Prompt Engineering:** Craft a good prompt to send to the AI. The prompt should include the code to be reviewed and clear instructions on what kind of feedback you're looking for.
*   **API Calls:** Use a library like `axios` or `node-fetch` to make API calls to the AI model.

### 5. Deployment

*   **Hosting:** Deploy the server to a cloud provider like Heroku, AWS, or Google Cloud.
*   **Environment Variables:** Store sensitive information like the GitHub App private key and AI API key as environment variables.

## Running the Server and Testing Webhooks

To receive webhooks from GitHub, your local server needs to be accessible from the internet. We recommend using a tool like [ngrok](https://ngrok.com/) to create a secure tunnel to your localhost.

1.  **Start the server:**

    ```bash
    npm start
    ```

2.  **Expose your local server with ngrok:**

    ```bash
    ngrok http 3000
    ```

    Ngrok will give you a public URL (e.g., `https://<random-string>.ngrok.io`).

3.  **Update your GitHub App's webhook URL:**

    *   Go to your GitHub App's settings.
    *   In the "Webhook" section, update the "Webhook URL" to the ngrok URL, followed by `/webhook`. For example: `https://<random-string>.ngrok.io/webhook`.
    *   Make sure to also set a "Webhook secret" and save it. We will use this later to verify the webhooks.

4.  **Test the webhook:**

    *   Create a new pull request in a repository where you've installed the GitHub App.
    *   You should see a "Webhook received!" message in your server's console. This confirms that your server is correctly receiving events from GitHub.

## Final Steps

Congratulations! The application is now feature-complete. Here's how to get it running:

1.  **Configure your environment variables:**

    *   Create a `.env` file in the root of the project.
    *   Add the following variables:

        ```
        WEBHOOK_SECRET=your-webhook-secret
        GITHUB_APP_ID=your-app-id
        PRIVATE_KEY_PATH=./private-key.pem
        AI_API_KEY=your-ai-api-key
        ```

    *   Replace the placeholder values with your actual credentials.

2.  **Install the dependencies:**

    ```bash
    npm install
    ```

3.  **Start the server:**

    ```bash
    npm start
    ```

4.  **Expose your local server with ngrok:**

    ```bash
    ngrok http 3000
    ```

5.  **Configure your GitHub App:**

    *   Make sure your GitHub App is installed in the repository you want to review.
    *   Update the webhook URL with your ngrok URL.

Now, when you create a new pull request, the application will automatically review the code and post comments.

## What's Next?

This is a basic implementation of a code reviewer. Here are some ideas for future improvements:

*   **Improve the AI prompt:** Craft a more detailed prompt for the AI model to get more specific and higher-quality reviews.
*   **Support different AI models:** Add a configuration option to switch between different AI models.
*   **Batch comments:** Instead of posting a comment for each line, batch the comments into a single review.
*   **Add a web interface:** Create a web interface to configure the application and view review history.
*   **More comprehensive diff parsing:** The current diff parser only handles added lines. It could be extended to handle modified and deleted lines as well.
