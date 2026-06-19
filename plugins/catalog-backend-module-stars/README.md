# @backstage/plugin-catalog-backend-module-stars

This module provides an opt-in database-backed implementation for Starred Entities in Backstage.
It exposes a backend router to manage user's starred entities.

## Installation

Add the module to your backend builder:

```typescript
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// ... other plugins
backend.add(import('@backstage/plugin-catalog-backend-module-stars'));

backend.start();
```

## Setup

Once installed, the module will automatically run database migrations on the `catalog` plugin's database during initialization and mount endpoints on `/api/catalog/starred-entities`.

To consume this backend, you also need to install the frontend counterpart `@backstage/plugin-catalog-module-stars` in your app.
