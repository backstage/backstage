---
'@backstage/plugin-auth-backend': minor
---

**BREAKING**: Hardened the default allowed patterns for CIMD and DCR to replace the previous permissive `['*']` wildcards with specific defaults for known MCP clients. If you previously relied on the default `['*']` patterns, you will need to explicitly configure the patterns you need in your `app-config.yaml`.

**CIMD (`experimentalClientIdMetadataDocuments`):**

- `allowedClientIdPatterns` now defaults to Claude, VS Code, and the built-in Backstage CLI instead of `['*']`
- `allowedRedirectUriPatterns` now defaults to loopback addresses (localhost, 127.0.0.1, [::1]) instead of `['*']`

**DCR (`experimentalDynamicClientRegistration`):**

- `allowedRedirectUriPatterns` now defaults to Cursor and loopback addresses instead of `['*']`

If you need to allow additional clients or redirect URIs, you can override these defaults in your `app-config.yaml`:

```yaml
auth:
  experimentalClientIdMetadataDocuments:
    enabled: true
    allowedClientIdPatterns:
      - 'https://claude.ai/*'
      - 'https://vscode.dev/*'
      - 'https://my-custom-client.example.com/*'
    allowedRedirectUriPatterns:
      - 'http://localhost:*'
      - 'http://127.0.0.1:*'
      - 'https://my-app.example.com/callback'
  experimentalDynamicClientRegistration:
    enabled: true
    allowedRedirectUriPatterns:
      - 'cursor://*'
      - 'http://localhost:*'
      - 'http://127.0.0.1:*'
      - 'myapp://*'
```
