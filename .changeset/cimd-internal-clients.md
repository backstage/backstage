---
'@backstage/plugin-auth-backend': minor
---

Added support for Client ID Metadata Documents (CIMD) as an experimental feature.

This allows Backstage to act as an OAuth 2.0 authorization server that supports the [IETF Client ID Metadata Document draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/). External OAuth clients can use HTTPS URLs as their `client_id`, and Backstage will fetch metadata from those URLs to validate the client.

**Key features:**

- **External CIMD clients**: Clients can host their own metadata documents at HTTPS URLs
- **Internal CIMD clients**: Backstage can host metadata documents for configured clients at `/.well-known/oauth-client/{name}`
- **Security**: SSRF protection, document size limits, forbidden auth method validation

**Configuration example:**

```yaml
auth:
  experimentalClientIdMetadataDocuments:
    enabled: true
    allowedRedirectUriPatterns:
      - 'http://localhost:*'
      - 'https://*.example.com/*'
    clients:
      - name: cli
        redirectUris:
          - http://localhost:8080/callback
        clientName: My CLI Tool
        scope: openid
```

The internal client above would be available at `https://backstage.example.com/api/auth/.well-known/oauth-client/cli` and can be used as the `client_id` in OAuth flows.
