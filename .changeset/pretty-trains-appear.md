---
'@backstage/backend-common': patch
'@backstage/cli': patch
'@backstage/core-app-api': patch
'@backstage/create-app': patch
'@backstage/techdocs-common': patch
'@backstage/plugin-auth-backend': patch
'@backstage/plugin-azure-devops-backend': patch
'@backstage/plugin-badges-backend': patch
'@backstage/plugin-bazaar-backend': patch
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-code-coverage-backend': patch
'@backstage/plugin-github-actions': patch
'@backstage/plugin-jenkins-backend': patch
'@backstage/plugin-proxy-backend': patch
'@backstage/plugin-rollbar-backend': patch
'@backstage/plugin-search-backend': patch
'@backstage/plugin-techdocs': patch
'@backstage/plugin-techdocs-backend': patch
---

Change default port of backend from 7000 to 7007.

This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

```
backend:
  listen: 0.0.0.0:7123
  baseUrl: http://localhost:7123
```

More information can be found here: https://backstage.io/docs/conf/writing
