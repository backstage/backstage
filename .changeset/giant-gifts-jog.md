---
'@backstage/plugin-scaffolder-backend-module-sentry': patch
---

- Custom Sentry Domains are now supported and can be configured via the 'apiBaseUrl' property
- A new Action for Client Creation has been added. Create a Client key with 'sentry:client:create' and retrieve the needed sentry keys in the returned json response
