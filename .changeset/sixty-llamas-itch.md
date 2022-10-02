---
'@backstage/plugin-scaffolder': patch
---

Make it possible to enable useLongPollingLogs in scaffolder plugin.

For that you have to add to your app-config.yaml file this snippet:

```yaml
scaffolder:
  useLongPollingLogs: true
```

By default, the value is falsy.
