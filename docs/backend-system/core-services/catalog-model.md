---
id: catalog-model
title: Catalog Model (alpha)
sidebar_label: Catalog Model (alpha)
description: Documentation for the Catalog Model Service
---

## Overview

The Catalog Model Service is the consumer-facing counterpart to the [Catalog Model Registry](./catalog-model-registry.md). It aggregates all annotation registrations from across plugins and provides methods to list them and validate entities against their schemas.

This service is root-scoped, meaning there is a single instance shared across the backend.

## How it Works

The service reads from a shared store that all Catalog Model Registry instances write to. Reads are lazy, so the service always returns the latest state of all registrations.

### `listAnnotations`

Returns all registered annotation descriptors, optionally filtered by entity kind.

Each descriptor includes:

- **`key`:** The annotation key, such as `backstage.io/kubernetes-id`
- **`pluginId`:** The plugin that registered this annotation
- **`entityKind`:** The entity kind this annotation applies to
- **`description`:** Human-readable description from the Zod `.describe()` call
- **`schema`:** The annotation's validation schema as JSON Schema

### `validateEntity`

Validates an entity's annotations against all registered schemas for that entity's kind. Only annotations that are present on the entity are validated. Missing annotations are not treated as errors.

Returns a result with:

- **`valid`:** Whether all present annotations passed validation
- **`errors`:** Array of validation errors, each including the `pluginId`, `annotation` key, and error `message`

## Using the Service

### Listing Annotations

```typescript
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { catalogModelServiceRef } from '@backstage/backend-plugin-api/alpha';

export const myPlugin = createBackendPlugin({
  pluginId: 'my-plugin',
  register(env) {
    env.registerInit({
      deps: {
        catalogModel: catalogModelServiceRef,
      },
      async init({ catalogModel }) {
        // List all registered annotations
        const all = catalogModel.listAnnotations();

        // List annotations for a specific entity kind
        const componentAnnotations = catalogModel.listAnnotations({
          entityKind: 'Component',
        });
      },
    });
  },
});
```

### Validating an Entity

```typescript
const result = catalogModel.validateEntity({
  kind: 'Component',
  metadata: {
    annotations: {
      'backstage.io/kubernetes-id': 'my-service',
    },
  },
});

if (!result.valid) {
  for (const error of result.errors) {
    logger.warn(
      `Annotation ${error.annotation} from ${error.pluginId}: ${error.message}`,
    );
  }
}
```

### Using in a Request Handler

The service is most useful when consumed on incoming requests rather than during plugin init, since all plugins will have registered their annotations by then.

```typescript
router.get('/annotations', (req, res) => {
  const entityKind = req.query.kind as string | undefined;
  const annotations = catalogModel.listAnnotations(
    entityKind ? { entityKind } : undefined,
  );
  res.json({ annotations });
});

router.post('/validate', async (req, res) => {
  const entity = req.body;
  const result = catalogModel.validateEntity(entity);
  res.json(result);
});
```

## Best Practices

For guidance on registering annotations, naming conventions, and schema design, see the [Catalog Model Registry](./catalog-model-registry.md#best-practices) documentation.
