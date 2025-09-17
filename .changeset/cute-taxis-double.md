---
'@backstage/backend-defaults': minor
'@backstage/integration': minor
---

**Attention:** Support for Bitbucket Cloud's API token was added. App password is deprecated (no new creation from September 9, 2025) and will be removed on June 9, 2026.

```yaml
integrations:
  bitbucketCloud:
    # Option 1 (recommended): API Token
    token: ${BITBUCKET_API_TOKEN}

    # Option 2 (legacy): App Password
    # username: my-bitbucket-username
    # appPassword: ${BITBUCKET_APP_PASSWORD}
```
