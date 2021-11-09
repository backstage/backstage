---
'@backstage/create-app': patch
---

Removed the version pinning of the packages `graphql-language-service-interface` and `graphql-language-service-parser`. This should no longer be necessary.

You can apply the same change in your repository by ensuring that the following does _NOT_ appear in your root `package.json`.

```json
"resolutions": {
  "graphql-language-service-interface": "2.8.2",
  "graphql-language-service-parser": "1.9.0"
  },
```
