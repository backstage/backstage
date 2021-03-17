---
'@backstage/create-app': patch
---

Adds example groups and users to the default app template.

To apply this change in an existing application, change the following in `app-config.yaml`:

```diff
     - type: url
       target: https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-apis.yaml

+    # Backstage example organization groups
+    - type: url
+      target: https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/acme/org.yaml
+      rules:
+        - allow: [Group, User]
+
     # Backstage example templates
     - type: url
       target: https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/sample-templates/react-ssr-template/template.yaml
```
