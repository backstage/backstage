---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

Fixed bug resulting from missing required owner and repo arguments in `octokit getEnvironmentPublicKey in action `github:environment:create`.

Adding environment secrets now works as expected.

```diff
  const publicKeyResponse = await client.rest.actions.getEnvironmentPublicKey({
    repository_id: repository.data.id,
+     owner,
+     repo,
      environment_name: name
  });
```
