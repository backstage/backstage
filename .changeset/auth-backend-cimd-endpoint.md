---
'@backstage/plugin-auth-backend': patch
---

Added optional client metadata document endpoint at `/.well-known/oauth-client/cli.json` for CLI authentication. Enabled when `auth.experimentalClientIdMetadataDocuments.enabled` is set to `true`.
