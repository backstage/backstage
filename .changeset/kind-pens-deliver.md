---
'@backstage/cli': minor
'@backstage/techdocs-common': minor
'@backstage/plugin-auth-backend': minor
'@backstage/plugin-kafka-backend': minor
'@backstage/plugin-kubernetes-backend': minor
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-techdocs-backend': minor
---

remove usage of res.send() for res.json() and res.end() to ensure content types are more consistently application/json on backend responses and error cases
