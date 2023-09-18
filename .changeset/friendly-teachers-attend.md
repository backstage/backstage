---
'@backstage/backend-common': patch
---

The root logger is now initialized lazily, fixing a circular dependency issue with `@backstage/backend-app-api` that would result in `Cannot read properties of undefined (reading 'redacter')`.
