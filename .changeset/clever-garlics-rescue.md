---
'@backstage/plugin-catalog-backend': minor
---

**BREAKING**: Removed `GitLabDiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-gitlab`. NOTE THAT this processor was part of the default set of processors in the catalog backend, and if you are a user of discovery on GitLab, you MUST now add it manually in the catalog initialization code of your backend.

```diff
// In packages/backend/src/plugins/catalog.ts
+import { GitLabDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-gitlab';

 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
   const builder = await CatalogBuilder.create(env);
+  builder.addProcessor(
+    GitLabDiscoveryProcessor.fromConfig(env.config, { logger: env.logger })
+  );
```

**BREAKING**: Removed `BitbucketDiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-bitbucket`. NOTE THAT this processor was part of the default set of processors in the catalog backend, and if you are a user of discovery on Bitbucket, you MUST now add it manually in the catalog initialization code of your backend.

```diff
// In packages/backend/src/plugins/catalog.ts
+import { BitbucketDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-bitbucket';

 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
   const builder = await CatalogBuilder.create(env);
+  builder.addProcessor(
+    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger })
+  );
```

**BREAKING**: Removed `AzureDevOpsDiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-azure`. This processor was not part of the set of default processors. If you were using it, you should already have a reference to it in your backend code and only need to update the import.

**BREAKING**: Removed the formerly deprecated type `BitbucketRepositoryParser`, which is no longer necessary since its only use was in `BitbucketDiscoveryProcessor` but is now instead inlined there.
