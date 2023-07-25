---
'@backstage/plugin-devtools-backend': patch
---

Add DevTools configuration to enable dependency listing to be filtered with custom prefixes. For instance, in your `app-config.yaml`:

```yaml
devTools:
  info:
    packagePrefixes:
      - @backstage/
      - @roadiehq/backstage-
      - @spotify/backstage-
```
