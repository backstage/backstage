# @backstage/plugin-catalog-module-stars

This module provides the frontend API implementation to back your `StarredEntitiesApi` with a robust backend database, replacing the default `localStorage`-based implementation.

## Installation

Add the module to your App dependencies:

```bash
yarn workspace app add @backstage/plugin-catalog-module-stars
```

Override the default `starredEntitiesApiRef` in your app's API registry:

```typescript
// packages/app/src/apis.ts
import {
  AnyApiFactory,
  discoveryApiRef,
  createApiFactory,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { starredEntitiesApiRef } from '@backstage/plugin-catalog-react';
import { DatabaseStarredEntitiesApi } from '@backstage/plugin-catalog-module-stars';

export const apis: AnyApiFactory[] = [
  // ... other APIs
  createApiFactory({
    api: starredEntitiesApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      fetchApi: fetchApiRef,
      identityApi: identityApiRef,
    },
    factory: ({ discoveryApi, fetchApi, identityApi }) =>
      new DatabaseStarredEntitiesApi({ discoveryApi, fetchApi, identityApi }),
  }),
];
```

## Setup

For this to work, you MUST install the `@backstage/plugin-catalog-backend-module-stars` in your backend so the database routing is available.
