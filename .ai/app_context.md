# Application Context

This document describes the architecture and purpose of the AI Code Reviewer application.

## Purpose

The application is a centralized backend service that provides automated, AI-powered code reviews for multiple Git providers (e.g., GitHub, GitLab, Bitbucket).

It listens for webhook events from these providers, fetches the code changes from a pull/merge request, sends them to an AI model for analysis, and posts the feedback as inline comments.

## Architecture

The system is designed with a provider-based architecture to ensure scalability and extensibility.

- **Webhook Ingress**: A single `server.js` acts as a router, identifying the source of a webhook and passing it to the correct provider adapter.
- **Provider Adapters**: Located in `src/providers/`, each adapter (e.g., `src/providers/github/`) implements a standard interface for interacting with a specific version control system. It handles provider-specific authentication, API calls, and data formats.
- **Core Logic**: Located in `src/core/`, this provider-agnostic layer orchestrates the main business logic: fetching diffs, interacting with the AI, parsing results, and formatting comments.
- **AI Service**: The `src/core/ai.js` module is responsible for communicating with the external AI model API.
