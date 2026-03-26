---
'@backstage/plugin-catalog-unprocessed-entities': patch
---

The unprocessed entities view is now primarily intended for use as a tab within the DevTools plugin. The standalone page is still available but disabled by default. To re-enable it, add the following to your `app-config.yaml`:

```yaml
app:
  extensions:
    - page:catalog-unprocessed-entities
```
