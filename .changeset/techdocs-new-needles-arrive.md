---
'@backstage/techdocs-common': patch
'@backstage/plugin-techdocs-backend': patch
---

TechDocs will throw warning in backend logs when legacy git preparer or dir preparer is used to preparer docs. Migrate to URL Preparer by updating `backstage.io/techdocs-ref` annotation to be prefixed with `url:`.
Detailed docs are here https://backstage.io/docs/features/techdocs/how-to-guides#how-to-use-url-reader-in-techdocs-prepare-step
See benefits and reason for doing so https://github.com/backstage/backstage/issues/4409
