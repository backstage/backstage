---
'@backstage/plugin-catalog': patch
---

Update the default entity page extension component to support grouping multiple entity content items in the same tab.

Disable a default group via configuration:

```diff
# app-config.yaml
app:
  extensions:
    # Pages
+   - page:catalog/entity:
+       config:
+         groups:
+           deployment: false
```

Change a default group title via configuration:

```diff
# app-config.yaml
app:
  extensions:
    # Pages
+   - page:catalog/entity:
+       config:
+         groups:
+           deployment: Infrastructure # this is overriding the default group title
```

Create a custom entity content group via configuration:

```diff
# app-config.yaml
app:
  extensions:
    # Pages
+   - page:catalog/entity:
+       config:
+         groups:
+           # <id>: <Title>
+           custom: Custom
```
