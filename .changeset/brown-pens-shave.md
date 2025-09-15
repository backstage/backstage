---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

Add `auto_init` option to `github:repo:create` action to create repository with an initial commit containing a README.md file

This initial commit is created by GitHub itself and the commit is signed, so the repository will not be empty after creation.

```diff
  - action: github:repo:create
    id: init-new-repo
    input:
      repoUrl: 'github.com?repo=repo&owner=owner'
      description: This is the description
      visibility: private
+     autoInit: true

```
