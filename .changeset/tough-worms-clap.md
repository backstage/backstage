---
'@backstage/plugin-scaffolder-backend': patch
---

Fix parsing of the path to default to empty string not undefined if git-url-parse throws something we don't expect. Fixes the error `The "path" argument must be of type string.` when preparing.
