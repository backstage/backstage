---
'@backstage/techdocs-common': patch
'@backstage/plugin-auth-backend': patch
'@backstage/plugin-kafka-backend': patch
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-techdocs-backend': patch
---

remove usage of res.send() for res.json() and res.end() to ensure content types are more consistently application/json on backend responses and error cases
