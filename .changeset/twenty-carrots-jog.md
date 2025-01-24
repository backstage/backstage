---
'@backstage/backend-app-api': patch
---

Added a configuration to permit backend plugin failures on startup:

```yaml
backend:
  ...
  startup:
    plugin-x:
      optional: true
```

This configuration permits `plugin-x` to fail on startup. Omitting the `startup`
configuration matches the previous behavior, wherein any individual plugin
failure is fatal to backend startup.
