---
'@backstage/create-app': patch
---

Add type resolutions for `@types/react` and `types/react-dom`. This is an

To apply these changes to your existing installation. Add a resolutions block to your `package.json`

```json
  "resolutions": {
    "@types/react": "^17",
    "@types/react-dom": "^17"
  },
```

If your existing app depend on react 16 use this resolution block instead.

```json
  "resolutions": {
    "@types/react": "^16",
    "@types/react-dom": "^16"
  },
```
