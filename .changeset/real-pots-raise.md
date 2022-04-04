---
'@backstage/plugin-catalog-backend-module-bitbucket': patch
---

Split `BitbucketDiscoveryProcessor` into `BitbucketCloudDiscoveryProcessor` and `BitbucketServerDiscoveryProcessor`.

Deprecates `BitbucketDiscoveryProcessor` in favor of its two replacements which will
use both of them under the hood until its removal.

**Migration for Bitbucket Cloud users:**

Previous setup:

```yaml
catalog:
  locations:
    - type: bitbucket-cloud-discovery
      target: https://bitbucket.org/workspaces/my-workspace
```

```typescript
// In packages/backend/src/plugins/catalog.ts
import { BitbucketDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-bitbucket';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(
    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
  );
  // [...]
}
```

New setup:

```yaml
catalog:
  locations:
    - type: bitbucket-cloud-discovery
      target: https://bitbucket.org/workspaces/my-workspace
```

```typescript
// In packages/backend/src/plugins/catalog.ts
import { BitbucketCloudDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-bitbucket';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(
    BitbucketCloudDiscoveryProcessor.fromConfig(env.config, {
      logger: env.logger,
    }),
  );
  // [...]
}
```

**Migration for Bitbucket Server users:**

Previous setup:

```yaml
catalog:
  locations:
    - type: bitbucket-discovery
      target: https://bitbucket.mycompany.com/projects/my-project/repos/service-*/catalog-info.yaml
```

```typescript
// In packages/backend/src/plugins/catalog.ts
import { BitbucketDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-bitbucket';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(
    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
  );
  // [...]
}
```

New setup:

```yaml
catalog:
  locations:
    - type: bitbucket-server-discovery
      target: https://bitbucket.mycompany.com/projects/my-project/repos/service-*/catalog-info.yaml
```

```typescript
// In packages/backend/src/plugins/catalog.ts
import { BitbucketServerDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-bitbucket';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(
    BitbucketServerDiscoveryProcessor.fromConfig(env.config, {
      logger: env.logger,
    }),
  );
  // [...]
}
```
