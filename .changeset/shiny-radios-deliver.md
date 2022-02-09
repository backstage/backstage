---
'@backstage/plugin-scaffolder': patch
---

Encode the `formData` in the `queryString` using `JSON.stringify` to keep the types in the decoded value
