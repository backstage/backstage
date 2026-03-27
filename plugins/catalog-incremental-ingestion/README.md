# Catalog Incremental Ingestion

Frontend support for the catalog incremental ingestion module.

## Features

- Adds an `Incremental Ingestion` tab to DevTools in apps using the new frontend system
- Shows provider health, current state, next action timing, and stored marks
- Supports admin actions such as `trigger` and mark cleanup through the catalog backend admin routes

## Setup

1. Install the backend module `@backstage/plugin-catalog-backend-module-incremental-ingestion`
2. Install this frontend plugin in your app
3. Add the alpha plugin export to your app features

```tsx
import catalogIncrementalIngestionPlugin from '@backstage/plugin-catalog-incremental-ingestion/alpha';

const app = createApp({
  features: [catalogIncrementalIngestionPlugin],
});
```

The DevTools tab becomes available automatically once the backend admin routes are enabled.
