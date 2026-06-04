# @backstage/plugin-events-backend-module-msgraph

The Microsoft Graph backend module for the `@backstage/plugin-events-backend` plugin.

This module helps you ingest Microsoft Graph change notifications into Backstage events. It does two things:

- Registers an HTTP ingress for the `msgraph` topic and validates incoming webhook requests.
- Subscribes to `msgraph` events and republishes them to specific topics for user/group upsert and delete operations.

## Installation

Install the [`@backstage/plugin-events-backend`](../events-backend/README.md) plugin if you have not done so already.

Then add this module to your backend package:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-msgraph
```

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-events-backend-module-msgraph'));
```

## Configuration

Add module configuration in your `app-config.yaml`:

```yaml
events:
  modules:
    msgraph:
      # Public URL that Microsoft Graph can call
      notificationUrl: ${MSGRAPH_NOTIFICATION_URL}

      # Resource types to subscribe to
      subscriptionResources:
        - users
        - groups

      # Entra tenant and app registration credentials
      tenantId: ${MSGRAPH_TENANT_ID}
      clientId: ${MSGRAPH_CLIENT_ID}
      clientSecret: ${MSGRAPH_CLIENT_SECRET}

      # Optional startup delay before subscription scheduling
      startupDelay: 30 seconds
```

## Published Topics

After receiving Microsoft Graph notifications on `msgraph`, the module republishes:

- `msgraph/upsert` with payload items in the shape `{ resourceType, resourceId }`.
- `msgraph/delete` with payload items in the shape `{ entityRef }`.

For delete events, the module resolves entity references from the catalog using these annotations:

- `metadata.annotations.graph.microsoft.com/user-id` for users
- `metadata.annotations.graph.microsoft.com/group-id` for groups
