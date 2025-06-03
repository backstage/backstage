---
'@backstage/repo-tools': patch
---

Remove exported `const` objects from the `modelEnum` template files for the server and client, as they were causing issues when defining `enum` schemas
