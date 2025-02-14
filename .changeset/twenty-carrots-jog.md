---
'@backstage/backend-app-api': patch
---

Added a configuration to permit backend plugin failures on startup:

```yaml
backend:
  ...
  startup:
    plugins:
      plugin-x:
        onPluginBootFailure: continue
```

This configuration permits `plugin-x` to fail on startup. Omitting the
`onPluginBootFailure` configuration matches the previous behavior, wherein any
individual plugin failure aborts backend startup.

The default can also be changed, so that continuing on failure is the default
unless otherwise specified:

```yaml
backend:
  startup:
    default:
      onPluginBootFailure: continue
    plugins:
      catalog:
        onPluginBootFailure: abort
```
