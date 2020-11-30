---
'@backstage/create-app': patch
---

Removed `"resolutions"` entry for `esbuild` in the root `package.json` in order to use the version specified by `@backstage/cli`.

To apply this change to an existing app, remove the following from your root `package.json`:

```json
"resolutions": {
  "esbuild": "0.6.3"
},
```
