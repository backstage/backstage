---
'@backstage/plugin-newrelic': minor
---

The New Relic plugin now uses the Backstage proxy to communicate with New Relic's API.

Please update your `app-config.yaml` as follows:

```yaml
# Old Config
newrelic:
  api:
    baseUrl: 'https://api.newrelic.com/v2'
    key: NEW_RELIC_REST_API_KEY
```

```yaml
# New Config
proxy:
  '/newrelic/apm/api':
    target: https://api.newrelic.com/v2
    headers:
      X-Api-Key:
        $env: NEW_RELIC_REST_API_KEY
```
