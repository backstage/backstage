---
'@backstage/backend-defaults': patch
'@backstage/integration': patch
---

Allow token to be set in config for BitBucketCloud integration

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
