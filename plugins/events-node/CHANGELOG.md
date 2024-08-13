# @backstage/plugin-events-node

## 0.3.9-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3

## 0.3.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2

## 0.3.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1

## 0.3.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.0

## 0.3.8

### Patch Changes

- b05e1e1: Service factories exported by this package have been updated to use the new service factory format that doesn't use a callback.
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0

## 0.3.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.22-next.1

## 0.3.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0

## 0.3.5

### Patch Changes

- 6a576dc: Replace the usage of `getVoidLogger` with `mockServices.logger.mock` in order to remove the dependency with the soon-to-be-deprecated `backend-common` package.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19

## 0.3.5-next.2

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3

## 0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2

## 0.3.5-next.0

### Patch Changes

- 6a576dc: Replace the usage of `getVoidLogger` with `mockServices.logger.mock` in order to remove the dependency with the soon-to-be-deprecated `backend-common` package.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.0

## 0.3.4

### Patch Changes

- 7e5a50d: added `eventsServiceFactory` to `defaultServiceFactories` to resolve issue where different instances of the EventsServices could be used
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.18

## 0.3.4-next.2

### Patch Changes

- 7e5a50d: added `eventsServiceFactory` to `defaultServiceFactories` to resolve issue where different instances of the EventsServices could be used

## 0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.18-next.0

## 0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17

## 0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.1

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.0

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.16

## 0.3.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.15

## 0.3.0

### Minor Changes

- eff3ca9: BREAKING CHANGE: Migrate `EventRouter` implementations from `EventBroker` to `EventsService`.

  `EventRouter` uses the new `EventsService` instead of the `EventBroker` now,
  causing a breaking change to its signature.

  All of its extensions and implementations got adjusted accordingly.
  (`SubTopicEventRouter`, `AzureDevOpsEventRouter`, `BitbucketCloudEventRouter`,
  `GerritEventRouter`, `GithubEventRouter`, `GitlabEventRouter`)

  Required adjustments were made to all backend modules for the new backend system,
  now also making use of the `eventsServiceRef` instead of the `eventsExtensionPoint`.

  **Migration:**

  Example for implementations of `SubTopicEventRouter`:

  ```diff
    import {
      EventParams,
  +   EventsService,
      SubTopicEventRouter,
    } from '@backstage/plugin-events-node';

    export class GithubEventRouter extends SubTopicEventRouter {
  -   constructor() {
  -     super('github');
  +   constructor(options: { events: EventsService }) {
  +     super({
  +       events: options.events,
  +       topic: 'github',
  +     });
      }

  +   protected getSubscriberId(): string {
  +     return 'GithubEventRouter';
  +   }
  +
      // ...
    }
  ```

  Example for a direct extension of `EventRouter`:

  ```diff
    class MyEventRouter extends EventRouter {
  -   constructor(/* ... */) {
  +   constructor(options: {
  +     events: EventsService;
  +     // ...
  +   }) {
  -     super();
        // ...
  +     super({
  +       events: options.events,
  +       topics: topics,
  +     });
      }
  +
  +   protected getSubscriberId(): string {
  +     return 'MyEventRouter';
  +   }
  -
  -   supportsEventTopics(): string[] {
  -     return this.topics;
  -   }
    }
  ```

### Patch Changes

- 56969b6: Add new `EventsService` as well as `eventsServiceRef` for the new backend system.

  **Summary:**

  - new:
    `EventsService`, `eventsServiceRef`, `TestEventsService`
  - deprecated:
    `EventBroker`, `EventPublisher`, `EventSubscriber`, `DefaultEventBroker`, `EventsBackend`,
    most parts of `EventsExtensionPoint` (alpha),
    `TestEventBroker`, `TestEventPublisher`, `TestEventSubscriber`

  Add the `eventsServiceRef` as dependency to your backend plugins
  or backend plugin modules.

  **Details:**

  The previous implementation using the `EventsExtensionPoint` was added in the early stages
  of the new backend system and does not respect the plugin isolation.
  This made it not compatible anymore with the new backend system.

  Additionally, the previous interfaces had some room for simplification,
  supporting less exposure of internal concerns as well.

  Hereby, this change adds a new `EventsService` interface as replacement for the now deprecated `EventBroker`.
  The new interface does not require any `EventPublisher` or `EventSubscriber` interfaces anymore.
  Instead, it is expected that the `EventsService` gets passed into publishers and subscribers,
  and used internally. There is no need to expose anything of that at their own interfaces.

  Most parts of `EventsExtensionPoint` (alpha) are deprecated as well and were not usable
  (by other plugins or their modules) anyway.

  The `DefaultEventBroker` implementation is deprecated and wraps the new `DefaultEventsService` implementation.
  Optionally, an instance can be passed as argument to allow mixed setups to operate alongside.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14

## 0.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.2

## 0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1

## 0.3.0-next.0

### Minor Changes

- eff3ca9: BREAKING CHANGE: Migrate `EventRouter` implementations from `EventBroker` to `EventsService`.

  `EventRouter` uses the new `EventsService` instead of the `EventBroker` now,
  causing a breaking change to its signature.

  All of its extensions and implementations got adjusted accordingly.
  (`SubTopicEventRouter`, `AzureDevOpsEventRouter`, `BitbucketCloudEventRouter`,
  `GerritEventRouter`, `GithubEventRouter`, `GitlabEventRouter`)

  Required adjustments were made to all backend modules for the new backend system,
  now also making use of the `eventsServiceRef` instead of the `eventsExtensionPoint`.

  **Migration:**

  Example for implementations of `SubTopicEventRouter`:

  ```diff
    import {
      EventParams,
  +   EventsService,
      SubTopicEventRouter,
    } from '@backstage/plugin-events-node';

    export class GithubEventRouter extends SubTopicEventRouter {
  -   constructor() {
  -     super('github');
  +   constructor(options: { events: EventsService }) {
  +     super({
  +       events: options.events,
  +       topic: 'github',
  +     });
      }

  +   protected getSubscriberId(): string {
  +     return 'GithubEventRouter';
  +   }
  +
      // ...
    }
  ```

  Example for a direct extension of `EventRouter`:

  ```diff
    class MyEventRouter extends EventRouter {
  -   constructor(/* ... */) {
  +   constructor(options: {
  +     events: EventsService;
  +     // ...
  +   }) {
  -     super();
        // ...
  +     super({
  +       events: options.events,
  +       topics: topics,
  +     });
      }
  +
  +   protected getSubscriberId(): string {
  +     return 'MyEventRouter';
  +   }
  -
  -   supportsEventTopics(): string[] {
  -     return this.topics;
  -   }
    }
  ```

### Patch Changes

- 56969b6: Add new `EventsService` as well as `eventsServiceRef` for the new backend system.

  **Summary:**

  - new:
    `EventsService`, `eventsServiceRef`, `TestEventsService`
  - deprecated:
    `EventBroker`, `EventPublisher`, `EventSubscriber`, `DefaultEventBroker`, `EventsBackend`,
    most parts of `EventsExtensionPoint` (alpha),
    `TestEventBroker`, `TestEventPublisher`, `TestEventSubscriber`

  Add the `eventsServiceRef` as dependency to your backend plugins
  or backend plugin modules.

  **Details:**

  The previous implementation using the `EventsExtensionPoint` was added in the early stages
  of the new backend system and does not respect the plugin isolation.
  This made it not compatible anymore with the new backend system.

  Additionally, the previous interfaces had some room for simplification,
  supporting less exposure of internal concerns as well.

  Hereby, this change adds a new `EventsService` interface as replacement for the now deprecated `EventBroker`.
  The new interface does not require any `EventPublisher` or `EventSubscriber` interfaces anymore.
  Instead, it is expected that the `EventsService` gets passed into publishers and subscribers,
  and used internally. There is no need to expose anything of that at their own interfaces.

  Most parts of `EventsExtensionPoint` (alpha) are deprecated as well and were not usable
  (by other plugins or their modules) anyway.

  The `DefaultEventBroker` implementation is deprecated and wraps the new `DefaultEventsService` implementation.
  Optionally, an instance can be passed as argument to allow mixed setups to operate alongside.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.13-next.0

## 0.2.19

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10

## 0.2.19-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.3

## 0.2.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.2

## 0.2.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1

## 0.2.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.0

## 0.2.18

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9

## 0.2.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2

## 0.2.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.1

## 0.2.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.0

## 0.2.17

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8

## 0.2.17-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.3

## 0.2.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.2

## 0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.1

## 0.2.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.0

## 0.2.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7

## 0.2.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2

## 0.2.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.1

## 0.2.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.0

## 0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.6

## 0.2.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.6-next.2

## 0.2.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.5-next.1

## 0.2.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.5-next.0

## 0.2.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3

## 0.2.12-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.3

## 0.2.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.2

## 0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.1

## 0.2.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.2-next.0

## 0.2.9

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0

## 0.2.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2

## 0.2.9-next.1

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.1

## 0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.5-next.0

## 0.2.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.4

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.4-next.0

## 0.2.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.3

## 0.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.3-next.2

## 0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.3-next.1

## 0.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.3-next.0

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2

## 0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.1

## 0.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.0

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1

## 0.2.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1-next.2

## 0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1-next.1

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1-next.0

## 0.2.4

### Patch Changes

- 928a12a9b3e: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.5.0

## 0.2.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.2

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.1

## 0.2.4-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.0

## 0.2.3

### Patch Changes

- 19d4abf72c: Make `EventParams` typed for implementing tidier event handling.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0

## 0.2.3-next.2

### Patch Changes

- 19d4abf72c: Make `EventParams` typed for implementing tidier event handling.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.2-next.1

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.2-next.0

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0

## 0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0

## 0.2.0

### Minor Changes

- cf41eedf43: Introduce a new interface `RequestDetails` to abstract `Request`
  providing access to request body and headers.

  **BREAKING:** Replace `request: Request` with `request: RequestDetails` at `RequestValidator`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.0

## 0.2.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.0-next.3

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.0-next.2

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.5-next.1

## 0.2.0-next.0

### Minor Changes

- cf41eedf43: Introduce a new interface `RequestDetails` to abstract `Request`
  providing access to request body and headers.

  **BREAKING:** Replace `request: Request` with `request: RequestDetails` at `RequestValidator`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.5-next.0

## 0.1.0

### Minor Changes

- dc9da28abd: Support events received via HTTP endpoints at plugin-events-backend.

  The plugin provides an event publisher `HttpPostIngressEventPublisher`
  which will allow you to receive events via
  HTTP endpoints `POST /api/events/http/{topic}`
  and will publish these to the used event broker.

  Using a provided custom validator, you can participate in the decision
  which events are accepted, e.g. by verifying the source of the request.

  Please find more information at
  https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md.

- 7bbd2403a1: Adds a new backend plugin plugin-events-backend for managing events.

  plugin-events-node exposes interfaces which can be used by modules.

  plugin-events-backend-test-utils provides utilities which can be used while writing tests e.g. for modules.

  Please find more information at
  https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.4
