---
'@backstage/backend-app-api': patch
---

Added a configuration to permit backend plugin module failures on startup:

```yaml
backend:
  ...
  startup:
    plugins:
      plugin-x:
        modules:
          module-y:
            onPluginModuleBootFailure: continue
```

This configuration permits `plugin-x` with `module-y` to fail on startup. Omitting the
`onPluginModuleBootFailure` configuration matches the previous behavior, wherein any
individual plugin module failure is forwarded to the plugin and aborts backend startup.

The default can also be changed, so that continuing on failure is the default
unless otherwise specified:

```yaml
backend:
  startup:
    default:
      onPluginModuleBootFailure: continue
    plugins:
      catalog:
        modules:
          github:
            onPluginModuleBootFailure: abort
```
