---
'@backstage/plugin-scaffolder-backend': patch
---

Bitbucket server needs username to be set as well as the token or appPassword for the publishing process to work.

```yaml
integrations:
  bitbucket:
    - host: bitbucket.mycompany.com
      apiBaseUrl: https://bitbucket.mycompany.com/rest/api/1.0
      token: token
      username: username
```
