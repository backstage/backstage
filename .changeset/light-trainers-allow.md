---
'@backstage/backend-common': patch
'@backstage/config': patch
'@backstage/config-loader': patch
'@backstage/plugin-app-backend': patch
---

Loading of app configurations now reference the `@deprecated` construct from
JSDoc to determine if a property in-use has been deprecated. Users are notified
of deprecated keys in the format:

```txt
The configuration key 'catalog.processors.githubOrg' of app-config.yaml is deprecated and may be removed soon. Configure a GitHub integration instead.
```

When the `withDeprecatedKeys` option is set to `true` in the `process` method
of `loadConfigSchema`, the user will be notified that deprecated keys have been
identified in their app configuration.

The `backend-common` and `plugin-app-backend` packages have been updated to set
`withDeprecatedKeys` to true so that users are notified of deprecated settings
by default.
