---
'@backstage/plugin-techdocs': minor
'@backstage/plugin-techdocs-backend': minor
---

When newer documentation available but not built, show older documentation while async building newer
TechDocs backend: /sync endpoint added to support above, returns immediate success if docs don't need a build, returns delayed success after build if needed
TechDocs backend: /docs endpoint removed as frontend can directly request to techdocs.storageUrl or /static/docs
