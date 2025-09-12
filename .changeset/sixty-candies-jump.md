---
'@backstage/plugin-catalog-backend-module-gitlab': minor
---

Update GitlanDiscoveryEntityProvider to prefer the immutable project.id over the mutable project.path_with_namespace when calling GitLab repository file API

Solves [#30147](https://github.com/backstage/backstage/issues/30147):

> Use of project.id avoids edgecases caused by path encoding or project structure changes
> [...]
> It also simplifies reasoning about the GitLab API usage, since IDs are immutable, while paths are not.

```diff
+/**
+ * Return the unique project identifier, preferring the numeric ID when available.
+ * @param project - The GitLab project object.
+ * @param [fallback=''] - A fallback string to use if neither ID nor path_with_namespace is available.
+ * @returns The project identifier as a string.
+ */
+ private getProjectIdentifier(
+ project: GitLabProject,
+ fallback: string = '',
+ ): string {
+ return project.id?.toString() ?? project.path_with_namespace ?? fallback;
+ }

// ...

const hasFile = await client.hasFile(
-  project.path_with_namespace ?? '',
+  this.getProjectIdentifier(project),
  project_branch,
  this.config.catalogFile,
);
```
