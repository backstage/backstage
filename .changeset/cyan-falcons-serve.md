---
'@backstage/plugin-scaffolder': patch
---

Removed check for deprecated `bitbucket` integration from `repoPickerValidation` function used by the `RepoUrlPicker`, it now validates the `bitbucketServer` and `bitbucketCloud` integrations instead.
