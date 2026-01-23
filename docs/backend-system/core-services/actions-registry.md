---
id: actions-registry
title: Actions Registry (alpha)
sidebar_label: Actions Registry (alpha)
description: Documentation for the Actions Registry Service
---

## Overview

The Actions Registry Service is a core service designed to provide a distributed registry for actions that can be executed within Backstage backend plugins. This service allows plugins to register reusable actions with well-defined schemas and execution logic, promoting consistency and reusability across the Backstage ecosystem.

## Action Structure

Each action registered with the service must conform to the `ActionsRegistryActionOptions` type, which includes:

### Required Properties

- **`name`:** A unique identifier for the action (string)
- **`title`:** A human-readable title for the action (string)
- **`description`:** A detailed description of what the action does (string)
- **`schema`:** Object containing input and output schema definitions
  - **`input`:** Function that returns a Zod schema for validating input
  - **`output`:** Function that returns a Zod schema for validating output
- **`action`:** The async function that executes the action logic

### Optional Properties

- **`attributes`:** Object containing behavioral flags:
  - **`destructive`:** Boolean indicating if the action modifies or deletes data
  - **`idempotent`:** Boolean indicating if running the action multiple times produces the same result
  - **`readOnly`:** Boolean indicating if the action only reads data without modifications

### Action Context

When an action is executed, it receives a context object (`ActionsRegistryActionContext`) containing:

- **`input`:** The validated input data matching the defined input schema
- **`logger`:** A LoggerService instance for logging within the action
- **`credentials`:** BackstageCredentials for authentication and authorization

## Using the Service

### Registering an Action

Here's an example of how to register an action with the Actions Registry Service:

```typescript
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

export function registerMyActions(actionsRegistry: ActionsRegistryService) {
  // Register a simple read-only action
  actionsRegistry.register({
    name: 'fetch-user-info',
    title: 'Fetch User Information',
    description: 'Retrieves user information from the catalog',
    schema: {
      input: z =>
        z.object({
          userRef: z.string(),
          includeGroups: z.boolean().optional(),
        }),
      output: z =>
        z.object({
          user: z.object({
            name: z.string(),
            email: z.string(),
            groups: z.array(z.string()).optional(),
          }),
        }),
    },
    attributes: {
      readOnly: true,
      idempotent: true,
    },
    action: async ({ input, logger, credentials }) => {
      logger.info(`Fetching user info for ${input.userRef}`);

      // Perform the action logic here
      const user = await fetchUserFromCatalog(input.userRef, credentials);

      return {
        output: {
          user: {
            name: user.name,
            email: user.email,
            groups: input.includeGroups ? user.groups : undefined,
          },
        },
      };
    },
  });

  // Register a destructive action
  actionsRegistry.register({
    name: 'delete-entity',
    title: 'Delete Entity',
    description: 'Removes an entity from the catalog',
    schema: {
      input: z =>
        z.object({
          entityRef: z.string(),
          force: z.boolean().optional(),
        }),
      output: z =>
        z.object({
          deletedEntities: z.array(z.string()),
        }),
    },
    attributes: {
      destructive: true,
      idempotent: false,
    },
    action: async ({ input, logger, credentials }) => {
      logger.warn(`Deleting entity ${input.entityRef}`);

      // Perform the deletion logic here
      const { deletedEntities } = await deleteEntityFromCatalog(
        input.entityRef,
        input.force,
        credentials,
      );

      return {
        output: deletedEntities,
      };
    },
  });
}
```

### Accessing the Service in a Plugin

To use the Actions Registry Service in your plugin, access it through dependency injection:

```typescript
import {
  createBackendPlugin,
  coreServices,
} from '@backstage/backend-plugin-api';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';

export const myPlugin = createBackendPlugin({
  pluginId: 'my-plugin',
  register(env) {
    env.registerInit({
      deps: {
        actionsRegistry: actionsRegistryServiceRef,
        logger: coreServices.logger,
      },
      async init({ actionsRegistry, logger }) {
        logger.info('Registering actions...');
        registerMyActions(actionsRegistry);
        logger.info('Actions registered successfully');
      },
    });
  },
});
```

## Best Practices

### Naming Conventions

- **Use kebab-case:** Action names should be in kebab-case (e.g., `fetch-user-info`, `create-repository`)
- **Be Descriptive:** Choose names that clearly describe what the action does
- **Avoid Redundancy:** Don't include plugin names in action names since the plugin context is separate
- **Use Verbs:** Start action names with verbs that describe the operation (e.g., `fetch`, `create`, `delete`, `update`)

## Action Attributes Reference

| Attribute     | Type    | Default | Description                                                         |
| ------------- | ------- | ------- | ------------------------------------------------------------------- |
| `destructive` | boolean | `true`  | Indicates the action modifies or deletes data. Use with caution.    |
| `idempotent`  | boolean | `false` | Indicates the action can be run multiple times with the same result |
| `readOnly`    | boolean | `false` | Indicates the action only reads data without making modifications   |

These attributes help consumers of actions understand their behavior and implement appropriate safeguards, retries, or optimizations based on the action's characteristics.
