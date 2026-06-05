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

## How it works

Unlike GitHub webhook events, MS Graph events cannot be configured in the portal. Client Apps have to create new
subscriptions themselves, specifying the webhook URLs, verification secrets/tokens and all other
params [through an endpoint](https://learn.microsoft.com/en-us/graph/change-notifications-delivery-webhooks?tabs=javascript#create-a-subscription).
The new module `@backstage/plugin-catalog-backend-module-msgraph` looks up deleted entity references in the Catalog and
re-publishes events to more specific `upsert`/`delete` topics.

```mermaid
sequenceDiagram
  participant eventsModuleMicrosoftGraphWebhook
  participant EventsPlugin
  participant WebhookRequestValidator
  participant MicrosoftGraphEventRouter
  participant CatalogService
  participant MicrosoftGraphIncrementalEntityProvider
  eventsModuleMicrosoftGraphWebhook ->> EventsPlugin: eventsExtensionPoint.addHttpPostIngress
  EventsPlugin ->> WebhookRequestValidator: createWebhookRequestValidator
  loop on schedule
    Note over eventsModuleMicrosoftGraphWebhook: after lifecycle.addStartupHook
    eventsModuleMicrosoftGraphWebhook ->> eventsModuleMicrosoftGraphWebhook: MicrosoftGraphSubscriptionManager.ensureActiveSubscriptions
  end
  EventsPlugin ->> WebhookRequestValidator: webhook event request
  WebhookRequestValidator ->> WebhookRequestValidator: validate request
  WebhookRequestValidator ->> EventsPlugin: request secret valid
  EventsPlugin ->> MicrosoftGraphEventRouter: MS Graph change/delete events<br/>published via "msgraph" topic
  MicrosoftGraphEventRouter ->> MicrosoftGraphEventRouter: validate payloads
  MicrosoftGraphEventRouter ->> EventsPlugin: change/add events re-published via "msgraph/upsert" topic
  MicrosoftGraphEventRouter ->> CatalogService: find deleted entities by MS Graph IDs
  CatalogService ->> MicrosoftGraphEventRouter: deleted entityRefs
  MicrosoftGraphEventRouter ->> EventsPlugin: delete events re-published via "msgraph/delete" topic
  EventsPlugin ->> MicrosoftGraphIncrementalEntityProvider: "msgraph/upsert" and "msgraph/delete" topic events
```

All incoming event requests are validated on client secret.

```mermaid
sequenceDiagram
  participant WebhookRequestValidator
  participant MicrosoftGraphSubscriptionManager
  participant MicrosoftGraphSubscriptionsDatabaseClient
  participant MicrosoftGraphClient

  loop on schedule
    MicrosoftGraphSubscriptionManager ->> MicrosoftGraphSubscriptionManager: ensureActiveSubscriptions
    MicrosoftGraphSubscriptionManager ->> MicrosoftGraphSubscriptionsDatabaseClient: get current subscription IDs
    MicrosoftGraphSubscriptionsDatabaseClient ->> MicrosoftGraphSubscriptionManager: subscription IDs
    MicrosoftGraphSubscriptionManager ->> MicrosoftGraphClient: validateActiveSubscription
    MicrosoftGraphClient ->> MicrosoftGraphSubscriptionManager: expired/invalid subscriptions
    MicrosoftGraphSubscriptionManager ->> MicrosoftGraphClient: createSubscription
    MicrosoftGraphSubscriptionManager ->> MicrosoftGraphSubscriptionsDatabaseClient: insert subscription record with secret hash and salt
  end

  Note over WebhookRequestValidator: on new webhook event
  WebhookRequestValidator ->> MicrosoftGraphSubscriptionsDatabaseClient: databaseClient.getById(subscriptionId)
  MicrosoftGraphSubscriptionsDatabaseClient ->> WebhookRequestValidator: token_hash, token_salt
  WebhookRequestValidator ->> WebhookRequestValidator: reject request if token_hash !== hashValidationToken(clientState, token_salt)
```

Upsert/Delete events can later be received by `MicrosoftGraphOrgEntityProvider` or
`MicrosoftGraphIncrementalEntityProvider`. Group/User IDs from the Upsert events can be used to query MS Graph APIs for
all data necessary to build Group/User entities. Delete events already contain `CompoundEntityRefs` at this point.
Catalog entities can be deleted/added/updated via `connection.applyMutation({..., type: 'delta'})`.

## How to test locally

LocalTunnel can be used to receive webhook events in local environments.

1. `brew install localtunnel`
2. `lt --port 7007`
3. Copy the URL printed and add it to your events config:

```yaml
events:
  modules:
    msgraph:
      notificationUrl: https://shaggy-mirrors-admire.loca.lt/api/events/http/msgraph # append the URL here
      resources:
        - groups
        - users
      clientId: <...>
      clientSecret: <...>
      tenantId: <...>
```

4. Run with DEBUG log level if you want to see all messages `LOG_LEVEL=DEBUG yarn start backend`
