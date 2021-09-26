---
'@backstage/core-components': patch
---

The `<Link />` component now automatically instruments all link clicks using
the new Analytics API. Each click triggers a `click` event, containing the
text of the link the user clicked on, as well as the location to which the user
clicked. In addition, these events inherit plugin/extension-level metadata,
allowing clicks to be attributed to the plugin/extension/route containing the
link:

```json
{
  "action": "click",
  "subject": "Text content of the link that was clicked",
  "attributes": {
    "to": "/value/of-the/to-prop/passed-to-the-link"
  },
  "context": {
    "extension": "ExtensionInWhichTheLinkWasClicked",
    "pluginId": "plugin-in-which-link-was-clicked",
    "routeRef": "route-ref-in-which-the-link-was-clicked"
  }
}
```
