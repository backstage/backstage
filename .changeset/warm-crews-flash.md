---
'@backstage/plugin-kubernetes-backend': patch
---

Exclude the AWS session token from credential validation, because it's not necessary in this context.
