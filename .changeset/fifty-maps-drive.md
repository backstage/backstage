---
'@backstage/plugin-scaffolder-react': major
---

**BREAKING:** Fixed a [wrong behaviour in `SecretWidget`](https://github.com/backstage/backstage/issues/25966) where secrets are saved using the field name instead of the proper path in the `formData`. If you were using nested `SecretFields` they will now be on the correct nested value.

Example:

```
spec:
  type: service
  parameters:
    - title: Normal
      properties:
        nested:
          type: object
          properties:
            name:
              type: string
              ui:field: Secret
```

Before this change the secret would be accessible via `secrets.name` instead of `secrets.nested.name`.

Migration:

```diff
 steps:
   - id: debug
     name: debug
     action: debug:log
     input:
-      message: "Creating foo with name: ${{ secrets.name }}"
+      message: "Creating foo with name: ${{ secrets.nested.name }}"
```
