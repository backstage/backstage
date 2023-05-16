# search-backend-module-explore

> DISCLAIMER: The new backend system is in alpha, and so are the search backend module support for the new backend system. We don't recommend you to migrate your backend installations to the new system yet. But if you want to experiment, you can find getting started guides below.

This package exports explore backend modules responsible for extending search.

## Example

### Use default schedule

```tsx
// packages/backend-next/src/index.ts
import { createBackend } from '@backstage/backend-defaults';
import { searchPlugin } from '@backstage/plugin-search-backend/alpha';
import { searchModuleExploreCollator } from '@backstage/plugin-search-backend-module-explore/alpha';

const backend = createBackend();
backend.add(searchPlugin());
backend.add(searchModuleExploreCollator());
backend.start();
```

### Use custom schedule

```tsx
// packages/backend-next/src/index.ts
import { createBackend } from '@backstage/backend-defaults';
import { searchPlugin } from '@backstage/plugin-search-backend/alpha';
import { searchModuleExploreCollator } from '@backstage/plugin-search-backend-module-explore/alpha';

const schedule = {
  frequency: { minutes: 10 },
  timeout: { minutes: 15 },
  initialDelay: { seconds: 3 },
};

const backend = createBackend();
backend.add(searchPlugin());
backend.add(searchModuleExploreCollator({ schedule }));
backend.start();
```

### Using Auth Middleware

If your Backstage instance uses service-to-service authentication you can pass an optional tokenManager to the collator factory. This will ensure that the collator makes authenticated requests to the explore backend.

```tsx
indexBuilder.addCollator({
  schedule: every10MinutesSchedule,
  factory: ToolDocumentCollatorFactory.fromConfig(env.config, {
    discovery: env.discovery,
    logger: env.logger,
    tokenManager: env.tokenManager,
  }),
});
```
