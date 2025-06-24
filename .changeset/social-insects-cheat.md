---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

Added support for file deletion to `publish:github:pull-request` action.

Example usage:

```diff
  - action: publish:github:pull-request
    id: clean-up-pr
    input:
      description: This is the description
+     filesToDelete:
+       - outdated/changelog.md
+       - sample-file.txt
      owner: owner
      repo: repo
      title: Title Goes Here

```
