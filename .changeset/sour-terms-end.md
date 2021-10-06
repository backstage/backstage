---
'@backstage/plugin-git-release-manager': minor
---

Errors caused while patching can leave the release branch in a broken state. Most commonly caused due to merge errors.

This has been solved by introducing a dry run prior to patching the release branch. The dry run will attempt to cherry pick the selected patch commit onto a temporary branch created off of the release branch. If it succeeds, the temporary branch is deleted and the patch is applied on the release branch
