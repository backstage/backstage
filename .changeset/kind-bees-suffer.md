---
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-permission-backend': minor
'@backstage/plugin-permission-node': minor
'@backstage/plugin-playlist-backend': minor
---

Permission rules now require a schema (ZodSchema) that details the parameters a rule expects. This is to validate the parameters given to a rule and to provide more details of a rule via the metadata endpoint
