---
'@backstage/plugin-catalog-backend-module-github': patch
---

`GithubMultiOrgEntityProvider` now logs a warning and skips an org instead of failing the entire ingestion when no GitHub App installation can be found for that org. Previously, a single org without an installed GitHub App (for example because the app was installed by a user without organization owner permissions) would cause the whole read to throw, silently blocking ingestion for every other org as well.
