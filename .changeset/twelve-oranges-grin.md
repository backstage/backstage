---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Update GitlabDiscoveryEntityProvider to use `project.id` rather than `project.path_with_namespace` for `hasFile` check in `shouldProcessProject`

Solves [#30147](https://github.com/backstage/backstage/issues/30147):

> Use of project.id avoids edgecases caused by path encoding or project structure changes
> [...]
> It also simplifies reasoning about the GitLab API usage, since IDs are immutable, while paths are not.

```diff
const hasFile = await client.hasFile(
-    project.path_with_namespace,
+    project.id.toString(),
    project_branch,
    this.config.catalogFile,
);
```
