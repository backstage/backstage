---
'@backstage/techdocs-common': patch
'@backstage/plugin-techdocs-backend': patch
---

Using @backstage/integration package for GitHub/GitLab/Azure tokens and request options.

Most probably you do not have to make any changes in the app because of this change.
However, if you are using the `DirectoryPreparer` or `CommonGitPreparer` exported by
`@backstage/techdocs-common` package, you now need to add pass in a `config` (from `@backstage/config`)
instance as argument.

```
<!-- Before -->
    const directoryPreparer = new DirectoryPreparer(logger);
    const commonGitPreparer = new CommonGitPreparer(logger);
<!-- Now -->
    const directoryPreparer = new DirectoryPreparer(config, logger);
    const commonGitPreparer = new CommonGitPreparer(config, logger);
```
