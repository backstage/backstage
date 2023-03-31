# search-backend-module-catalog

> DISCLAIMER: The new backend system is in alpha, and so are the search backend module support for the new backend system. We don't recommend you to migrate your backend installations to the new system yet. But if you want to experiment, you can find getting started guides below.

This package exports catalog backend modules responsible for extending search.

## Example

### Use default schedule

```tsx
// packages/backend-next/src/index.ts
import { createBackend } from '@backstage/backend-defaults';
import { searchPlugin } from '@backstage/plugin-search-backend/alpha';
import { searchModuleCatalogCollator } from '@backstage/plugin-search-backend-module-catalog/alpha';

const backend = createBackend();
backend.add(searchPlugin());
backend.add(searchModuleCatalogCollator());
backend.start();
```

### Use custom schedule

```tsx
// packages/backend-next/src/index.ts
import { createBackend } from '@backstage/backend-defaults';
import { searchPlugin } from '@backstage/plugin-search-backend/alpha';
import { searchModuleCatalogCollator } from '@backstage/plugin-search-backend-module-catalog/alpha';

const schedule = {
  frequency: { minutes: 10 },
  timeout: { minutes: 15 },
  initialDelay: { seconds: 3 },
};

const backend = createBackend();
backend.add(searchPlugin());
backend.add(searchModuleCatalogCollator({ schedule }));
backend.start();
```
