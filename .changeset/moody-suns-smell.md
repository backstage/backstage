---
'@backstage/integration': minor
'@backstage/integration-react': minor
---

Split `bitbucket` integration into `bitbucketCloud` and `bitbucketServer`
(backwards compatible).

In order to migrate to the new integration configs,
move your configs from `integrations.bitbucket`
to `integrations.bitbucketCloud` or `integrations.bitbucketServer`.

Migration example:

**Before:**

```yaml
integrations:
  bitbucket:
    - host: bitbucket.org
      username: bitbucket_user
      appPassword: app-password
    - host: bitbucket-server.company.com
      token: my-token
```

**After:**

```yaml
integrations:
  bitbucketCloud:
    - username: bitbucket_user
      appPassword: app-password
  bitbucketServer:
    - host: bitbucket-server.company.com
      token: my-token
```
