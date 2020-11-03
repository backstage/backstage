---
'@backstage/backend-common': minor
'@backstage/cli': minor
'@backstage/config-loader': minor
'example-backend': patch
'@backstage/create-app': patch
---

**BREAKING CHANGE**

The existing loading of additional config files like `app-config.development.yaml` using APP_ENV or NODE_ENV has been removed.
Instead, the CLI and backend process now accept one or more `--config` flags to load config files.

Without passing any flags, `app-config.yaml` and, if it exists, `app-config.local.yaml` will be loaded.
If passing any `--config <path>` flags, only those files will be loaded, **NOT** the default `app-config.yaml` one.

The old behaviour of for example `APP_ENV=development` can be replicated using the following flags:

```bash
--config ../../app-config.yaml --config ../../app-config.development.yaml
```
