---
'@backstage/app-defaults': patch
---

Introduced an extra parameter in BackstagePlugin.
This optional parameter is responsible for providing a type for input options for the plugin.

```
myPlugin.__experimentalReconfigure({
...
});
```
