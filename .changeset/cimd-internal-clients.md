---
'@backstage/plugin-auth-backend': minor
---

Added experimental support for Client ID Metadata Documents (CIMD).

This allows Backstage to act as an OAuth 2.0 authorization server that supports the [IETF Client ID Metadata Document draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/). External OAuth clients can use HTTPS URLs as their `client_id`, and Backstage will fetch metadata from those URLs to validate the client.

**Configuration example:**

```yaml
auth:
  experimentalClientIdMetadataDocuments:
    enabled: true
    # Optional: restrict which `client_id` URLs are allowed (defaults to ['*'])
    allowedClientIdPatterns:
      - 'https://example.com/*'
      - 'https://*.trusted-domain.com/*'
    # Optional: restrict which redirect URIs are allowed (defaults to ['*'])
    allowedRedirectUriPatterns:
      - 'http://localhost:*'
      - 'https://*.example.com/*'
```

Clients using CIMD must host a JSON metadata document at their `client_id` URL containing at minimum:

```json
{
  "client_id": "https://example.com/.well-known/oauth-client/my-app",
  "client_name": "My Application",
  "redirect_uris": ["http://localhost:8080/callback"],
  "token_endpoint_auth_method": "none"
}
```
