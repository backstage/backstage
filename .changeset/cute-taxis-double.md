---
'@backstage/backend-defaults': minor
'@backstage/integration': minor
---

**Attention:** Support for Bitbucket Cloud's API token was added. App password is deprecated (no new creation from September 9, 2025) and will be removed on June 9, 2026.

API token (recommended):

```yaml
integrations:
  bitbucketCloud:
    - username: user@domain.com
      token: my-token
```

App password (deprecated):

```yaml
integrations:
  bitbucketCloud:
    - username: user
      appPassword: my-secret
```
