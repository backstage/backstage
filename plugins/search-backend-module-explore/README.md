# search-backend-module-explore

This package exports a module that extends the search backend to also indexing the tools exposed by the [`explore` service](https://github.com/backstage/backstage/tree/master/plugins/explore-backend).

## Installation

Add the module package as a dependency:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-search-backend-module-explore
```

Add the collator to your backend instance, along with the search plugin itself:

```tsx
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';
import { searchPlugin } from '@backstage/plugin-search-backend/alpha';
import { searchModuleExploreCollator } from '@backstage/plugin-search-backend-module-explore/alpha';

const backend = createBackend();
backend.add(searchPlugin());
backend.add(searchModuleExploreCollator());
backend.start();
```

You may also want to add configuration parameters to your app-config, for example for controlling the scheduled indexing interval. These parameters should be placed under the `search.collators.explore` key. See [the config definition file](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-explore/config.d.ts) for more details.

## Using Auth Middleware

If your Backstage instance uses service-to-service authentication, the collator will need to have access to a `tokenManager`. This is automatically injected by the collator module when using the new backend system. But if you are using the old backend system, you will want to add it manually to ensure that the collator makes authenticated requests to the explore backend.

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
