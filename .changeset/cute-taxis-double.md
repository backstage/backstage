---
'@backstage/backend-defaults': minor
'@backstage/integration': minor
---

**BREAKING** Bitbucket cloud now supports API token as App password will be deprecated soon.

```yaml
integrations:
  bitbucketCloud:
    - host: bitbucket.org
      # Option 1 (recommended): API Token
      token: ${BITBUCKET_API_TOKEN}

      # Option 2 (legacy): App Password
      # username: my-bitbucket-username
      # appPassword: ${BITBUCKET_APP_PASSWORD}
```
