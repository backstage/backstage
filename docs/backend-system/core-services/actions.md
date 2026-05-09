---
id: actions
title: Actions (alpha)
sidebar_label: Actions (alpha)
description: Documentation for the Actions Service
---

## Overview

The Actions Service is a core service that provides a standardized interface for discovering and executing registered actions within Backstage backend plugins. This service acts as the consumer-facing API for actions that have been registered through the Actions Registry Service, allowing plugins to list available actions and invoke them with proper authentication and input validation.

## How it Works

The Actions Service implements the `ActionsService` interface, which provides two primary methods:

- **`list()`:** Retrieves all available actions with their complete metadata
- **`invoke()`:** Executes a specific action by ID with provided input data

The service works in conjunction with the [Actions Registry Service](./actions-registry.md), where actions are registered by plugins and then made available for discovery and execution through this service.

## Action Identification

Actions are identified using a unique ID that follows a specific format:

- All action IDs are prefixed with the plugin ID that registered them, following the pattern `pluginId:actionName`
- An action named `fetch-user-info` registered by the `catalog` plugin would have the ID `catalog:fetch-user-info`
- When using the `actionsRegistryServiceMock`, the plugin ID prefix will be `test:`

This naming convention ensures that action names are globally unique across all plugins and provides clear ownership identification.

## Configuration

### Restricting action sources by plugin

The `pluginSources` configuration limits which plugins are allowed to register actions.

```yaml
backend:
  actions:
    pluginSources:
      - catalog
```

### Filtering actions

In addition to plugin-level restrictions, the Actions Service supports filtering actions using include and exclude rules. This allows fine-grained control over which actions are exposed or runnable in a Backstage instance.

Each filter rule can match by `id` (a [minimatch](https://github.com/isaacs/minimatch) glob against the full `pluginId:actionName` action ID), by `attributes`, or both. All specified fields in a rule must match for the rule to apply. Exclude rules take precedence — an action is excluded if it matches any exclude rule. When include rules are specified, only actions that match at least one include rule are kept.

#### Include actions from a specific plugin

```yaml
backend:
  actions:
    filter:
      include:
        - id: 'catalog:*'
```

#### Include actions matching multiple patterns

```yaml
backend:
  actions:
    filter:
      include:
        - id: 'catalog:*'
        - id: 'scaffolder:*'
```

#### Exclude specific actions by ID

```yaml
backend:
  actions:
    filter:
      exclude:
        - id: 'scaffolder:internal-*'
```

#### Exclude all destructive actions

```yaml
backend:
  actions:
    filter:
      exclude:
        - attributes:
            destructive: true
```

#### Include only read-only actions

```yaml
backend:
  actions:
    filter:
      include:
        - attributes:
            readOnly: true
```

#### Combine ID and attribute matching

A rule matches only if all specified conditions are met. The example below includes catalog actions that are idempotent, and excludes any destructive action regardless of plugin:

```yaml
backend:
  actions:
    filter:
      include:
        - id: 'catalog:*'
          attributes:
            idempotent: true
      exclude:
        - attributes:
            destructive: true
```

### Permissions

Actions registered with a `visibilityPermission` field are automatically checked against the permissions framework. When listing actions, any actions denied by the active permission policy are filtered out of the results. When invoking a denied action, a `404 Not Found` error is returned. See the [Actions Registry Permissions](./actions-registry.md#permissions) documentation for how to configure permissions on actions.

## Using the Service

### Listing Available Actions

Here's an example of how to list all available actions:

```typescript
import { ActionsService } from '@backstage/backend-plugin-api';

export async function listAvailableActions(
  actionsService: ActionsService,
  credentials: BackstageCredentials,
) {
  try {
    const { actions } = await actionsService.list({ credentials });

    console.log(`Found ${actions.length} available actions:`);

    actions.forEach(action => {
      console.log(`- ${action.id}: ${action.title}`);
      console.log(`  Description: ${action.description}`);
      console.log(`  Attributes: ${JSON.stringify(action.attributes)}`);

      if (action.schema.input) {
        console.log(
          `  Input Schema: ${JSON.stringify(action.schema.input, null, 2)}`,
        );
      }
    });

    return actions;
  } catch (error) {
    console.error('Failed to list actions:', error);
    throw error;
  }
}
```

### Invoking an Action

Here's an example of how to execute a specific action:

```typescript
import { ActionsService } from '@backstage/backend-plugin-api';

export async function executeAction(
  actionsService: ActionsService,
  actionId: string,
  input: JsonObject,
  credentials: BackstageCredentials,
) {
  try {
    const { output } = await actionsService.invoke({
      id: actionId,
      input,
      credentials,
    });

    console.log(`Action ${actionId} executed successfully`);
    console.log('Output:', JSON.stringify(output, null, 2));

    return output;
  } catch (error) {
    console.error(`Failed to execute action ${actionId}:`, error);
    throw error;
  }
}

// Example usage
async function fetchUserInfo(
  actionsService: ActionsService,
  credentials: BackstageCredentials,
) {
  const output = await executeAction(
    actionsService,
    'catalog:fetch-user-info', // Note: Action ID includes plugin prefix
    {
      userRef: 'user:default/john.doe',
      includeGroups: true,
    },
    credentials,
  );

  return output;
}
```

## Best Practices

For comprehensive guidance on action design, naming conventions, and schema design, see the [Actions Registry Best Practices](./actions-registry.md#best-practices) documentation.
