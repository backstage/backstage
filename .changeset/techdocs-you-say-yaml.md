---
'@backstage/techdocs-common': patch
---

TechDocs generator stage now supports `mkdocs.yaml` file, in addition to `.yml`
depending on whichever is present at the time of generation. (Assumes the
latest `spotify/techdocs` container, running mkdocs `v1.2.2` or greater).
