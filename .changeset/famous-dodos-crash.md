---
'@backstage/core-app-api': minor
'@backstage/frontend-app-api': patch
---

Allow for the disabling of external routes through config, which was rendered impossible after the introduction of default targets.

```yaml
app:
  routes:
    bindings:
      # This has the effect of removing the button for registering new
      # catalog entities in the scaffolder template list view
      scaffolder.registerComponent: false
```
