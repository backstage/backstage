---
'@backstage/plugin-catalog': minor
---

The order in which group tabs appear on the entity page has been changed.

### Before

Previously, entity contents determined the order in which groups were rendered, so a group was rendered as soon as its first entity content was detected.

### After

Groups are now rendered first by default based on their order in the `app-config.yaml` file:

```diff
app:
  extensions:
    - page:catalog/entity:
+       config:
+         groups:
+           # this will be the first tab of the default entity page
+           - deployment:
+               title: Deployment
+           # this will be the second tab of the default entiy page
+           - documentation:
+               title: Documentation
```

If you wish to place a normal tab before a group, you must add the tab to a group and place the group in the order you wish it to appear on the entity page (groups that contains only one tab are rendered as normal tabs).

```diff
app:
  extensions:
    - page:catalog/entity:
        config:
          groups:
+            # Example placing the overview tab first
+           - overview:
+               title: Overview
            - deployment:
                title: Deployment
            # this will be the second tab of the default entiy page
            - documentation:
                title: Documentation
    - entity-content:catalog/overview:
+       config:
+          group: 'overview'
```
