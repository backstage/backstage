---
'@backstage/plugin-scaffolder-backend-module-bitbucket': minor
---

Split `@backstage/plugin-scaffolder-backend-module-bitbucket` into
`@backstage/plugin-scaffolder-backend-module-bitbucket-cloud` and
`@backstage/plugin-scaffolder-backend-module-bitbucket-server`.

`@backstage/plugin-scaffolder-backend-module-bitbucket` was **deprecated** in favor of these two replacements.

Please use any of the two replacements depending on your needs.

```diff
- backend.add(import('@backstage/plugin-scaffolder-backend-module-bitbucket'));
+ backend.add(import('@backstage/plugin-scaffolder-backend-module-bitbucket-cloud'));
+ backend.add(import('@backstage/plugin-scaffolder-backend-module-bitbucket-server'));
```
