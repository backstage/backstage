---
'@backstage/plugin-api-docs': minor
'@backstage/plugin-catalog': minor
'@backstage/plugin-circleci': minor
'@backstage/plugin-cloudbuild': minor
'@backstage/plugin-github-actions': minor
'@backstage/plugin-jenkins': minor
'@backstage/plugin-kafka': minor
'@backstage/plugin-kubernetes': minor
'@backstage/plugin-lighthouse': minor
'@backstage/plugin-org': minor
'@backstage/plugin-rollbar': minor
'@backstage/plugin-sonarqube': minor
'@backstage/plugin-techdocs': minor
---

**BREAKING**: Removed support for passing in an explicit `entity` prop to entity page extensions, which has been deprecated for a long time. This is only a breaking change at the TypeScript level, as this property was already ignored.
