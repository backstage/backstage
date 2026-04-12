---
'@backstage/plugin-catalog-backend-module-github': patch
---

Fixed a bug where `GithubEntityProvider` with `validateLocationsExist: true` and `filters.branch` configured would always check for the catalog file on the repository's default branch (`HEAD`) instead of the configured branch. This caused repositories to be filtered out when the catalog file only existed on the non-default branch.
