---
'@backstage/backend-app-api': minor
---

Fixed plugin token handler to use node-fetch instead of native fetch to support corporate proxies when fetching `jwks.json`. This request will now respect `global-agent` proxy configurations.
