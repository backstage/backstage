---
id: integrating-event-driven-updates-with-entity-providers
title: Integrating Event-Driven Updates with Entity Providers
description: A guide on integrating the events system into an EntityProvider to enable immediate updates to the catalog.
---

This guide walks you through setting up an HTTP endpoint to receive events and integrating the Events System into an EntityProvider to enable immediate updates to the catalog. While the Events system supports other use cases, this guide focuses specifically on using HTTP-based events in an EntityProvider.

In the example provided, we demonstrate how to ingest entities from an external fictional service called `Frobs`.

Basic flow:

- An external service (`Frobs` in this example) sends events to an HTTP endpoint exposed by the `@backstage/plugin-events-backend` plugin. This endpoint corresponds to a topic you define (e.g., `frobs`).

- A module to extend the `@backstage/plugin-events-backend` plugin that exposes a custom Router, processes incoming events on this generic topic and routes them to more specific sub-topics based on the contents of each event’s payload.

- An `EntityProvider` subscribes to these specific sub-topic events and, upon receiving them, takes an action to add/update/delete entities in the catalog accordingly.

## Receiving Events via HTTP Endpoints

The `@backstage/plugin-events-backend` plugin provides out-of-the-box support for receiving events via HTTP endpoints. These events are then published to the `EventsService`.

To create HTTP endpoints for specific topics, you need to configure them in your app-config.yaml:

```
events:
  http:
    topics:
      - frobs
```

Only topics explicitly listed in this configuration will result in available HTTP endpoints.

The example above would create the following endpoints:

`POST /api/events/http/frobs`

You can use this URL as the payload URL when setting up your webhooks from external services. When an event is sent to this endpoint, the events-backend will publish it to the Events Service, making it available to any subscribed entity providers.

## Routing General Topics to Specific Subtopics

To effectively manage events, you can extend the event system to route general topics to more specific subtopics by creating a module for the `events-backend` plugin.

For example, when setting up a webhook for the `Frobs` service using the `POST /api/events/http/frobs` endpoint, all incoming events are initially published under the generic `frobs` topic. However, by republishing these events under more specific subtopics based on their payload — such as the type field — you allow your EntityProvider to subscribe only to the relevant subtopics it needs, rather than processing every event under the broader `frobs` topic.

Here's an example of a `SubTopicEventRouter` that subscribes to a generic `frobs` topic and then publishes events under a more concrete sub-topic based on the `$.type` provided in the event payload:

```ts
import {
  EventParams,
  EventsService,
  SubTopicEventRouter,
} from '@backstage/plugin-events-node';

/**
 * Subscribes to the generic `frobs` topic
 * and publishes the events under the more concrete sub-topic
 * depending on the `$.type` provided in the event payload.
 *
 * @public
 */
export class FrobsEventRouter extends SubTopicEventRouter {
  constructor(options: { events: EventsService }) {
    super({
      events: options.events,
      topic: 'frobs',
    });
  }

  protected getSubscriberId(): string {
    return 'FrobsEventRouter';
  }

  protected determineSubTopic(params: EventParams): string | undefined {
    if ('type' in (params.eventPayload as object)) {
      const payload = params.eventPayload as { type: string };
      return payload.type;
    }

    return undefined;
  }
}
```

## Integrating Events into an Entity Provider

Your entity provider can subscribe to specific event topics and react to incoming events. This allows for immediate updates to your catalog based on external triggers.

Here is the basic structure of an EntityProvider that incorporates event subscription. Check out the numbered markings below for a breakdown of each step:

```ts title="plugins/catalog-backend-module-frobs/src/FrobsProvider.ts"
import { Entity } from '@backstage/catalog-model';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import {
  SchedulerServiceTaskRunner,
  UrlReaderService,
} from '@backstage/backend-plugin-api';
import { EventsService, EventParams } from '@backstage/plugin-events-node';

/**
 * Provides entities from the fictional Frobs service.
 */
export class FrobsProvider implements EntityProvider {
  private readonly env: string;
  private readonly reader: UrlReaderService;
  private readonly taskRunner: SchedulerServiceTaskRunner;
  private readonly events?: EventsService;
  private connection?: EntityProviderConnection;

  constructor(
    env: string,
    reader: UrlReaderService,
    taskRunner: SchedulerServiceTaskRunner,
    /** [1] */
    events?: EventsService,
  ) {
    this.env = env;
    this.reader = reader;
    this.taskRunner = taskRunner;
    this.events = events;
  }

  getProviderName(): string {
    return `frobs-${this.env}`;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;

    /** [2] */
    await this.events?.subscribe({
      id: this.getProviderName(),
      topics: ['frobs-add', 'frobs-delete', 'frobs-modify'],
      /** [3] */
      onEvent: async (params: EventParams) => {
        const id = params.eventPayload.id;
        const baseUrl = `https://frobs-${id}.example.com/data`;

        const response = await this.reader.readUrl(baseUrl);
        const data = JSON.parse((await response.buffer()).toString());
        const entities: Entity[] = frobsToEntities(data);

        if (params.topic === 'frobs-add') {
          await this.connection!.applyMutation({
            type: 'delta',
            added: entities,
            removed: [],
          });
        } else if (params.topic === 'frobs-delete') {
          await this.connection!.applyMutation({
            type: 'delta',
            added: [],
            removed: entities,
          });
        } else if (params.topic === 'frobs-modify') {
          const oldResponse = await this.reader.readUrl(
            `${baseUrl}/previous-state`,
          );
          const oldData = JSON.parse((await oldResponse.buffer()).toString());
          const oldEntities: Entity[] = frobsToEntities(oldData);

          await this.connection!.applyMutation({
            type: 'delta',
            added: entities,
            removed: oldEntities,
          });
        }
      },
    });

    await this.taskRunner.run({
      id: this.getProviderName(),
      fn: async () => {
        await this.run();
      },
    });
  }

  async run(): Promise<void> {
    if (!this.connection) {
      throw new Error('FrobsProvider not initialized');
    }

    const response = await this.reader.readUrl(
      `https://frobs-${this.env}.example.com/data`,
    );
    const data = JSON.parse((await response.buffer()).toString());
    const entities: Entity[] = frobsToEntities(data);

    await this.connection.applyMutation({
      type: 'full',
      entities: entities.map(entity => ({
        entity,
        locationKey: `frobs-provider:${this.env}`,
      })),
    });
  }
}
```

Let's break down the key parts of this integration:

1. **Add EventsService as a Dependency**: In the EntityProvider's constructor, include `EventsService` as an optional dependency. This allows your provider to interact with the event system.

2. **Subscribe to Topics in connect**: Within the connect function, subscribe to the specific event topics that your plugin needs to react to (e.g., 'frobs-add', 'frobs-delete', 'frobs-modify').

3. **Implement the `onEvent` Method**: The `onEvent` method is crucial. It will be invoked whenever your provider receives an event for a subscribed topic. Inside this method:

   - Based on the event payload information (accessible through `params.eventPayload`), implement the logic to decide which entities should be added, deleted, or modified.
   - Use a delta mutation to explicitly upsert or delete entities. This approach is more efficient than updating the entire catalog from scratch. For more details on mutations, refer to the ["Provider Mutations" section](https://backstage.io/docs/features/software-catalog/external-integrations#provider-mutations).
