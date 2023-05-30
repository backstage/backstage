---
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-catalog-backend-module-github': patch
'@backstage/integration': patch
---

Add support for Repository Variables and Secrets to the `publish:github` and `github:repo:create` scaffolder actions. You will need to add `read/write` permissions to your GITHUB_TOKEN and/or Github Backstage App for Repository `Secrets` and `Variables`

Upgrade octokit introduces some breaking changes.
