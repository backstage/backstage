---
'@backstage/core-components': patch
---

The `<Link />` component now automatically instruments all link clicks using
the new Analytics API. Each click triggers a `click` event, containing the
location the user clicked to. In addition, these events inherit plugin-level
metadata, allowing clicks to be attributed to the plugin containing the link:

```json
{
  "action": "click",
  "subject": "/value/of-the/to-prop/passed-to-the-link",
  "context": {
    "componentName": "SomeAssociatedExtension",
    "pluginId": "plugin-in-which-link-was-clicked",
    "routeRef": "any-associated-route-ref-id"
  }
}
```
