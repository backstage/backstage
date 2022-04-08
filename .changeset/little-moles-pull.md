---
'@backstage/create-app': patch
---

Add type resolutions for `@types/react` and `types/react-dom`.

The reason for this is the usage of `"@types/react": "*"` as a dependency which is very common practice in react packages. This recently resolves to react 18 which introduces several breaking changes in both internal and external packages.

To apply these changes to your existing installation, add a resolutions block to your `package.json`

```json
  "resolutions": {
    "@types/react": "^17",
    "@types/react-dom": "^17"
  },
```

If your existing app depends on react 16, use this resolution block instead.

```json
  "resolutions": {
    "@types/react": "^16",
    "@types/react-dom": "^16"
  },
```
