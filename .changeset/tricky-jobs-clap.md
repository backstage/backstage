---
'@backstage/plugin-scaffolder-react': minor
'@backstage/plugin-scaffolder': minor
---

Replace `ui:widget: password` with the a warning message stating that it's not secure and to use the build in `SecretField`.

You can do this by updating your `template.yaml` files that have the reference `ui:widget: password` to `ui:field: Secret` instead.

```diff
apiVersion: backstage.io/v1alpha1
kind: Template
metadata:
  ...

spec:
  parameters:
    - title: collect some information
      schema:
        type: object
        properties:
          password:
            title: Password
            type: string
-            ui:widget: password
+            ui:field: Secret
  steps:
    - id: collect-info
      name: Collect some information
      action: acme:do:something
      input:
-        password: ${{ parameters.password }}
+        password: ${{ secrets.password }}
```
