---
'@backstage/backend-app-api': patch
'@backstage/backend-common': patch
'@backstage/cli': patch
---

Allow developers to enable JSON logging, and also enable it automatically when `NODE_ENV=production` environment variable is set and the server is started with Webpack.

- Added a new environment variable `LOG_FORMAT` that can be set to `json` to enforce winston json logging.
  This happens also automatically in a production environment when the env var `NODE_ENV=production` is set.
- Automatically set this new environment variable `LOG_FORMAT` with a warning message when someone uses `NODE_ENV=production`
  and a command that starts a local backstage instance that supports code reloading via webpack like `yarn start` or `backstage-cli package start`
