---
'@backstage/plugin-scaffolder-backend': minor
---

Added repositoryId return when creating a repository in Azure

```diff
output: {
    type: 'object',
    properties: {
        remoteUrl: {
            title: 'A URL to the repository with the provider',
            type: 'string',
        },
        repoContentsUrl: {
            title: 'A URL to the root of the repository',
            type: 'string',
        },
+        repositoryId: {
+            title: 'The Id of the created repository',
+            type: 'string',
+        },
    },
},


const remoteUrl = returnedRepo.remoteUrl;

if (!remoteUrl) {
    throw new InputError(
        'No remote URL returned from create repository for Azure',
    );
}
+const repositoryId = returnedRepo.id;

+if (!repositoryId) {
+    throw new InputError('No Id returned from create repository for Azure');
+}


ctx.output('remoteUrl', remoteUrl);
ctx.output('repoContentsUrl', repoContentsUrl);
+ctx.output('repositoryId', repositoryId);
```
