---
'@backstage/plugin-scaffolder-backend-module-github': minor
'@backstage/create-app': minor
---

**BREAKING** The `publish:github` scaffolder action now defaults to initializing with a branch named "main" instead of "master" when creating new repositories.

If you or your organization have relied on all new github repositories having a default branch name of "master" you **must** set the `defaultBranch: 'master'` in your existing templates that feature the `publish:github` scaffolder action.

To keep using the name "master" for your new github repos, these are the **required** changes:

```diff
    - id: publish
      name: Publish
      action: publish:github
      input:
        allowedHosts: ['github.com']
        description: This is ${{ parameters.name }}
        repoUrl: ${{ parameters.repoUrl }}
+       defaultBranch: 'master'
```
