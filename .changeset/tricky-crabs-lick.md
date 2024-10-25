---
'@backstage/plugin-scaffolder-backend-module-bitbucket-server': patch
'@backstage/plugin-scaffolder-backend-module-bitbucket-cloud': patch
---

Fix double branch creation in `public:bitbucket{Cloud,Server}:pull-request`
This resulted in the following error when using the actions:

```
AlreadyExistsError: Failed to create branch at create-test because it already exists.
```

The issue was original introduced in d103a48fa306d745599dc0c793668c9e6a479d32
