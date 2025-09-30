# Copilot Instructions for PMLD_UMKM_BSI Repository

## Overview
These instructions guide AI code assistants (like GitHub Copilot) in contributing to this repository. The goal is to ensure high-quality, secure, and maintainable code while preventing common pitfalls associated with AI-generated suggestions.

## Best Practices
1. **Verify Before Acting**: Always use available tools to gather context, check existing code, and verify APIs, dependencies, or project structure before making suggestions or changes. Do not assume knowledge; confirm with reads or searches.
2. **Follow Project Conventions**: Adhere strictly to the project's coding standards, file structure, naming conventions, and existing patterns. Reference README.md, configuration files (e.g., package.json, requirements.txt), and codebase examples.
3. **Prioritize Security and Quality**: Implement secure coding practices, validate inputs, avoid hardcoding sensitive data, and ensure code is robust. Use linters, formatters, and security scanners where available.
4. **Test and Validate Changes**: After any code modification, run relevant tests, linters, and builds to confirm functionality. Suggest or add unit tests, integration tests, or validation steps for new features.
5. **Be Concise and Accurate**: Provide minimal, correct, and idiomatic code. Avoid unnecessary complexity, verbose explanations, or over-engineering. Focus on solving the immediate problem.
6. **Document and Maintain**: Include clear comments for complex logic, update documentation (e.g., README, API docs), and ensure changes are maintainable. Preserve backward compatibility unless specified otherwise.
7. **Respect Existing Codebase**: Do not overwrite, refactor, or remove existing code without full understanding. Analyze dependencies and impacts before changes.

## Common Issues to Prevent
1. **Hallucinations and Inaccuracies**: Do not generate code referencing non-existent APIs, libraries, methods, or features. Always cross-reference with official documentation or project dependencies.
2. **Outdated or Incorrect Information**: Use current knowledge and verify versions of libraries, frameworks, and tools. Avoid suggesting deprecated practices.
3. **Ignoring Project Context**: Consider the full scope, including user requirements, existing architecture, and integration points. Do not make isolated changes that could break the system.
4. **Security Vulnerabilities**: Never suggest code prone to common issues like SQL injection, XSS, CSRF, or insecure defaults. Implement proper sanitization and authentication.
5. **Breaking Functionality**: Ensure changes do not introduce bugs, regressions, or build failures. Validate in a development environment before finalizing.
6. **Incomplete or Fragmented Solutions**: Provide complete, runnable code with all necessary imports, error handling, and edge cases covered. Do not leave placeholders or unfinished implementations.
7. **Over-Editing or Scope Creep**: Make targeted, minimal changes. Avoid broad refactors, renaming, or additions unless explicitly requested. Stick to the user's intent.

## Project-Specific Guidelines
- **No New Files/Folders**: Do not create additional files or directories. Refine and improve existing ones only.
- **Focus on UMKM and BSI Integration**: Prioritize features related to small business (UMKM) management within the BSI (Bank Syariah Indonesia) context. Ensure compliance with relevant standards.
- **Maintain Compatibility**: Preserve existing integrations, data flows, and user interfaces. Test changes in the context of the full application.

By following these guidelines, AI assistants can contribute effectively while minimizing risks and ensuring alignment with best practices.