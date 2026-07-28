---
'@backstage/plugin-auth-backend': patch
---

Fixed the built-in CLI client being rejected when `allowedClientIdPatterns` is configured for Client ID Metadata Documents.

Enabling CIMD makes the auth backend serve a client metadata document for the Backstage CLI at `/.well-known/oauth-client/cli.json`, and its `client_id` is one of the default `allowedClientIdPatterns`. Because configuring that key replaced the defaults outright, any deployment that allowlisted an additional client silently stopped accepting the CLI, which then failed with `Invalid client_id` even though the backend kept serving the document at 200.

The derived CLI pattern is now always allowed. Configuring `allowedClientIdPatterns` still replaces the Claude and VS Code defaults.
