# search-backend-module-techdocs

> DISCLAIMER: The new backend system is in alpha, and so are the search backend module support for the new backend system. We don't recommend you to migrate your backend installations to the new system yet. But if you want to experiment, you can find getting started guides below.

This package exports techdocs backend modules responsible for extending search.

## Example

### Use default schedule

```tsx
// packages/backend-next/src/index.ts
import { createBackend } from '@backstage/backend-defaults';
import { searchPlugin } from '@backstage/plugin-search-backend/alpha';
import { searchModuleTechDocsCollator } from '@backstage/plugin-search-backend-module-techdocs/alpha';

const backend = createBackend();
backend.add(searchPlugin());
backend.add(searchModuleTechDocsCollator());
backend.start();
```

### Use custom schedule

```tsx
// packages/backend-next/src/index.ts
import { createBackend } from '@backstage/backend-defaults';
import { searchPlugin } from '@backstage/plugin-search-backend/alpha';
import { searchModuleTechDocsCollator } from '@backstage/plugin-search-backend-module-techdocs/alpha';

const schedule = {
  frequency: { minutes: 10 },
  timeout: { minutes: 15 },
  initialDelay: { seconds: 3 },
};

const backend = createBackend();
backend.add(searchPlugin());
backend.add(searchModuleTechDocsCollator({ schedule }));
backend.start();
```
