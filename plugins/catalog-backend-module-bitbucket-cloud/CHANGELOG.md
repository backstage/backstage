# @backstage/plugin-catalog-backend-module-bitbucket-cloud

## 0.1.0

### Minor Changes

- dfc4efcbf0: Add new plugin `catalog-backend-module-bitbucket-cloud` with `BitbucketCloudEntityProvider`.

  This entity provider is an alternative/replacement to the `BitbucketDiscoveryProcessor` **_(for Bitbucket Cloud only!)_**.
  It replaces use cases using `search=true` and should be powerful enough as a complete replacement.

  If any feature for Bitbucket Cloud is missing and preventing you from switching, please raise an issue.

  **Before:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts

  builder.addProcessor(
    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
  );
  ```

  ```yaml
  # app-config.yaml

  catalog:
    locations:
      - type: bitbucket-discovery
        target: 'https://bitbucket.org/workspaces/workspace-name/projects/apis-*/repos/service-*?search=true&catalogPath=/catalog-info.yaml'
  ```

  **After:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    BitbucketCloudEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
    }),
  );
  ```

  ```yaml
  # app-config.yaml

  catalog:
    providers:
      bitbucketCloud:
        yourProviderId: # identifies your ingested dataset
          catalogPath: /catalog-info.yaml # default value
          filters: # optional
            projectKey: '^apis-.*
  ```

## 0.1.0-next.0

### Minor Changes

- dfc4efcbf0: Add new plugin `catalog-backend-module-bitbucket-cloud` with `BitbucketCloudEntityProvider`.

  This entity provider is an alternative/replacement to the `BitbucketDiscoveryProcessor` **_(for Bitbucket Cloud only!)_**.
  It replaces use cases using `search=true` and should be powerful enough as a complete replacement.

  If any feature for Bitbucket Cloud is missing and preventing you from switching, please raise an issue.

  **Before:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts

  builder.addProcessor(
    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
  );
  ```

  ```yaml
  # app-config.yaml

  catalog:
    locations:
      - type: bitbucket-discovery
        target: 'https://bitbucket.org/workspaces/workspace-name/projects/apis-*/repos/service-*?search=true&catalogPath=/catalog-info.yaml'
  ```

  **After:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    BitbucketCloudEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
    }),
  );
  ```

  ```yaml
  # app-config.yaml

  catalog:
    providers:
      bitbucketCloud:
        yourProviderId: # identifies your ingested dataset
          catalogPath: /catalog-info.yaml # default value
          filters: # optional
            projectKey: '^apis-.* # optional; RegExp
            repoSlug: '^service-.* # optional; RegExp
          workspace: workspace-name
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.1.0-next.0

# optional; RegExp

            repoSlug: '^service-.*

## 0.1.0-next.0

### Minor Changes

- dfc4efcbf0: Add new plugin `catalog-backend-module-bitbucket-cloud` with `BitbucketCloudEntityProvider`.

  This entity provider is an alternative/replacement to the `BitbucketDiscoveryProcessor` **_(for Bitbucket Cloud only!)_**.
  It replaces use cases using `search=true` and should be powerful enough as a complete replacement.

  If any feature for Bitbucket Cloud is missing and preventing you from switching, please raise an issue.

  **Before:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts

  builder.addProcessor(
    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
  );
  ```

  ```yaml
  # app-config.yaml

  catalog:
    locations:
      - type: bitbucket-discovery
        target: 'https://bitbucket.org/workspaces/workspace-name/projects/apis-*/repos/service-*?search=true&catalogPath=/catalog-info.yaml'
  ```

  **After:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    BitbucketCloudEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
    }),
  );
  ```

  ```yaml
  # app-config.yaml

  catalog:
    providers:
      bitbucketCloud:
        yourProviderId: # identifies your ingested dataset
          catalogPath: /catalog-info.yaml # default value
          filters: # optional
            projectKey: '^apis-.* # optional; RegExp
            repoSlug: '^service-.* # optional; RegExp
          workspace: workspace-name
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.1.0-next.0

# optional; RegExp

          workspace: workspace-name

````

### Patch Changes

- 9122060776: Updated dependency `msw` to `^0.42.0`.
- Updated dependencies
- @backstage/plugin-catalog-backend@1.2.0
- @backstage/backend-tasks@0.3.2
- @backstage/integration@1.2.1
- @backstage/plugin-bitbucket-cloud-common@0.1.0

## 0.1.0-next.0

### Minor Changes

- dfc4efcbf0: Add new plugin `catalog-backend-module-bitbucket-cloud` with `BitbucketCloudEntityProvider`.

This entity provider is an alternative/replacement to the `BitbucketDiscoveryProcessor` **_(for Bitbucket Cloud only!)_**.
It replaces use cases using `search=true` and should be powerful enough as a complete replacement.

If any feature for Bitbucket Cloud is missing and preventing you from switching, please raise an issue.

**Before:**

```typescript
// packages/backend/src/plugins/catalog.ts

builder.addProcessor(
  BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
);
````

```yaml
# app-config.yaml

catalog:
  locations:
    - type: bitbucket-discovery
      target: 'https://bitbucket.org/workspaces/workspace-name/projects/apis-*/repos/service-*?search=true&catalogPath=/catalog-info.yaml'
```

**After:**

```typescript
// packages/backend/src/plugins/catalog.ts
builder.addEntityProvider(
  BitbucketCloudEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }),
  }),
);
```

```yaml
# app-config.yaml

catalog:
  providers:
    bitbucketCloud:
      yourProviderId: # identifies your ingested dataset
        catalogPath: /catalog-info.yaml # default value
        filters: # optional
          projectKey: '^apis-.* # optional; RegExp
          repoSlug: '^service-.* # optional; RegExp
        workspace: workspace-name
```

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.1.0-next.0
