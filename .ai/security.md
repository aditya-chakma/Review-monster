# Security Guidelines

Security is a primary concern for this application. Follow these guidelines strictly.

## Webhooks
- **Signature Verification**: ALL incoming webhooks MUST have their signatures verified to ensure they originate from a trusted provider. Requests with invalid signatures must be rejected immediately with a `401 Unauthorized` status.

## Secrets Management
- **Environment Variables**: All secrets (API keys, private keys, webhook secrets) MUST be stored in environment variables. They must NEVER be hard-coded in the source code.
- **Private Keys**: Private keys should be stored securely and loaded into the application at runtime. Do not commit them to version control.
- **`.gitignore`**: Ensure that `.env` files and any files containing secrets (like `.pem` keys) are listed in the `.gitignore` file.

## API Interaction
- **Authentication**: All outbound API calls to Git providers or AI models must be properly authenticated.
- **Rate Limiting**: Be mindful of API rate limits. Implement backoff or queuing strategies if necessary.

## Input Handling
- **Data Validation**: Do not implicitly trust the data received in webhook payloads. Validate the structure and types where necessary, although signature verification provides a strong guarantee of integrity.
