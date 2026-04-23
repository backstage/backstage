---
'@backstage/plugin-catalog-backend-module-github': patch
---

`GithubMultiOrgEntityProvider` now logs a warning and skips to the next org
when a GitHub App is configured but not installed on one of the orgs listed
in the provider config, instead of aborting the whole refresh with a
`NotFoundError`. Orgs that do have the app installed continue to sync, and
the warning points to the GitHub App troubleshooting documentation.
