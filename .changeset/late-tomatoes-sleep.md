---
'@backstage/create-app': patch
---

Add `"files": ["dist"]` to both app and backend packages. This ensures that packaged versions of these packages do not contain unnecessary files.

To apply this change to an existing app, add the following to `packages/app/package.json` and `packages/backend/package.json`:

```json
  "files": [
    "dist"
  ]
```
