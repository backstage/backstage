---
'@backstage/plugin-newrelic-dashboard': minor
---

Added API Prefix config to allow for multiple API configurations

Added annotation: `newrelic.com/dashboard-api-prefix`

Allows for additional API configurations:

```
// app-config.yaml - Multiple Accounts
proxy:
  '/newrelic/api':
    target: https://api.newrelic.com
    headers:
      X-Api-Key: ${NEW_RELIC_USER_KEY}

  '/<api-prefix>/newrelic/api':
    target: https://api.newrelic.com
    headers:
      X-Api-Key: ${NEW_RELIC_ACCOUNT2_USER_KEY}
```
