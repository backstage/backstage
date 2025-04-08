---
'@backstage/plugin-catalog': patch
---

Update the default entity page extension component to support grouping multiple entity content items in the same tab.

Disable all default groups:

```diff
# app-config.yaml
app:
  extensions:
    # Pages
+   - page:catalog/entity:
+       config:
+         groups: []
```

Create a custom list of :

```diff
# app-config.yaml
app:
  extensions:
    # Pages
+   - page:catalog/entity:
+       config:
+         groups:
+           # This array of groups completely replaces the default groups
+           - custom:
+               title: 'Custom'
```
