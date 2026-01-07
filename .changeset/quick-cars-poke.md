---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

Added options to set [workflow access level][access-level] for repositories to `github:repo:create`

This is useful when creating repositories for GitHub Actions to manage access
to the workflows during creation.

```diff
 - action: github:repo:create
    id: create-repo
    input:
      repoUrl: github.com?owner=owner&repo=repo
      visibility: private
+     workflowAccess: organization
```

[access-level]: https://docs.github.com/en/rest/actions/permissions?apiVersion=2022-11-28#set-the-level-of-access-for-workflows-outside-of-the-repository
