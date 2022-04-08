---
'@backstage/create-app': patch
---

Add resolution for version 17 `@types/react` and `types/react-dom` due to breaking changes introduced in version 18.

To apply these changes to your existing installation. Add a resolutions block to your `package.json`

```json
  "resolutions": {
    "@types/react": "^17",
    "@types/react-dom": "^17"
  },
```

If your depending on react 16 in use this resolution block instead.

```json
  "resolutions": {
    "@types/react": "^16",
    "@types/react-dom": "^16"
  },
```
