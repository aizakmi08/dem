# Security Policy

## Supported Version

Security fixes target the current `main` branch.

## Reporting

Please do not publish sensitive security details in a public issue. Use GitHub's private vulnerability reporting when available, or contact the maintainer through the GitHub profile with a short summary and reproduction outline.

## Security Notes

- Do not commit real InstantDB, Google OAuth, RevenueCat, or other service credentials.
- Keep mobile client configuration in environment files or hosted secret managers.
- Treat auth, sync, subscriptions, and notification flows as security-sensitive changes.
- Review changes that touch profile data, progress sync, or purchase state for privacy impact.
