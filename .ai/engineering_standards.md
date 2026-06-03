# Engineering Standards

This document outlines the engineering and coding standards for this project.

## General
- **Language**: All code should be written in modern JavaScript (ES6+).
- **Style**: Follow a consistent code style. Use a linter and formatter (e.g., ESLint, Prettier) to enforce this.
- **Modularity**: Code should be organized into small, single-responsibility modules.
- **Asynchronicity**: Use `async/await` for all asynchronous operations. Avoid raw promises and callbacks where possible.
- **Error Handling**: All asynchronous operations and potential failure points must be wrapped in `try...catch` blocks. Errors should be logged with meaningful context.

## Node.js
- **Dependencies**: Use `npm` for package management. Keep dependencies up to date.
- **Environment Variables**: All configuration, especially secrets and credentials, must be managed through environment variables (`.env` file for local development). Do not hard-code configuration in the source code.
- **Logging**: Use a structured logger for application logs. Log important events, errors, and decisions.

## Version Control
- **Commits**: Write clear, descriptive commit messages.
- **Branches**: Use feature branches for all new work.
- **Pull Requests**: All code must be reviewed via a pull request before being merged into the main branch.
