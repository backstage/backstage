---
id: catalog-model-registry
title: Catalog Model Registry (alpha)
sidebar_label: Catalog Model Registry (alpha)
description: Documentation for the Catalog Model Registry Service
---

## Overview

The Catalog Model Registry Service allows backend plugins to register claims on parts of the catalog model, such as annotations on specific entity kinds. Plugins declare what annotations they own, provide validation schemas using Zod, and include descriptions for documentation purposes.

This service is plugin-scoped, meaning each plugin gets its own instance that is automatically namespaced by the plugin ID. Registrations are stored locally and exposed via HTTP endpoints, allowing the [Catalog Model](./catalog-model.md) consumer service to aggregate annotations across distributed plugin instances.

## Configuration

Plugins that register annotations must be listed in the `backend.catalogModel.pluginSources` config so the consumer service knows where to fetch from:

```yaml
backend:
  catalogModel:
    pluginSources:
      - kubernetes
      - my-plugin
```

## Registration Structure

Each registration call targets a specific entity kind and declares one or more annotations using a Zod schema callback.

### `registerAnnotations`

Registers annotation schemas for a given entity kind.

- **`entityKind`:** The kind of entity these annotations apply to, such as `Component` or `Resource`
- **`annotations`:** A callback that receives the Zod library and returns an object schema defining the annotations

The Zod callback pattern matches the Actions Registry approach. The callback receives `zod` as a parameter so that plugins don't need to manage their own Zod dependency.

## Using the Service

### Registering Annotations in a Plugin

```typescript
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { catalogModelRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';

export const myPlugin = createBackendPlugin({
  pluginId: 'my-plugin',
  register(env) {
    env.registerInit({
      deps: {
        catalogModelRegistry: catalogModelRegistryServiceRef,
      },
      async init({ catalogModelRegistry }) {
        catalogModelRegistry.registerAnnotations({
          entityKind: 'Component',
          annotations: zod =>
            zod.object({
              'my-plugin.io/instance-id': zod
                .string()
                .describe('The instance ID in my-plugin for this component'),
              'my-plugin.io/project-key': zod
                .string()
                .optional()
                .describe('The project key used to group components'),
            }),
        });
      },
    });
  },
});
```

### Registering Annotations for Multiple Entity Kinds

A plugin can register annotations on different entity kinds by calling `registerAnnotations` multiple times.

```typescript
catalogModelRegistry.registerAnnotations({
  entityKind: 'Component',
  annotations: zod =>
    zod.object({
      'my-plugin.io/service-id': zod
        .string()
        .describe('Links a component to its service in my-plugin'),
    }),
});

catalogModelRegistry.registerAnnotations({
  entityKind: 'Resource',
  annotations: zod =>
    zod.object({
      'my-plugin.io/cluster-name': zod
        .string()
        .optional()
        .describe('The cluster name for this resource'),
      'my-plugin.io/region': zod
        .string()
        .optional()
        .describe('The region where this resource is deployed'),
    }),
});
```

### Real-World Example: Kubernetes Plugin

The Kubernetes plugin uses the registry to declare its annotations on both Components and Resources:

```typescript
import { catalogModelRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';

// In the kubernetes plugin's init:
catalogModelRegistry.registerAnnotations({
  entityKind: 'Component',
  annotations: zod =>
    zod.object({
      'backstage.io/kubernetes-id': zod
        .string()
        .describe('Links a catalog entity to its Kubernetes resources'),
      'backstage.io/kubernetes-label-selector': zod
        .string()
        .optional()
        .describe('Label selector query for filtering Kubernetes resources'),
    }),
});
```

## Best Practices

### Annotation Naming

- Use a domain prefix that your plugin owns, such as `my-plugin.io/` or `backstage.io/`
- Use kebab-case for the annotation key after the prefix
- Be specific about what the annotation represents

### Schema Design

- Use `.optional()` for annotations that are not required for your plugin to function
- Use `.describe()` on every annotation to provide human-readable documentation
- Annotation values in catalog entities are always strings, so your schemas should expect string values. Use `zod.coerce` if you need to validate numeric or boolean formats

### Registration Timing

Registration happens during plugin `init()`. Registrations are served via HTTP, so consumers reading annotations after all plugins have initialized will see all registrations regardless of init order.
