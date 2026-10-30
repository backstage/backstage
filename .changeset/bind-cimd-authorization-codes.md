---
'@backstage/plugin-auth-backend': patch
---

Fixed authorization-code exchanges to require a client ID matching the client that obtained the code. Missing client IDs return `invalid_request`, and mismatched client IDs return `invalid_grant`. These rejections do not consume the code. Public CIMD clients must include their metadata document URL as `client_id`, in addition to the PKCE verifier. Upgrade `@backstage/cli-module-auth` when using the Backstage CLI to sign in.
