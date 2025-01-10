# @backstage/plugin-events-backend-test-utils

## 0.1.40-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.7-next.1

## 0.1.40-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.7-next.0

## 0.1.39

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.6

## 0.1.39-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.6-next.2

## 0.1.39-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.6-next.1

## 0.1.39-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.6-next.0

## 0.1.38

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5

## 0.1.38-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.3

## 0.1.38-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.2

## 0.1.38-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.4-next.1

## 0.1.38-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.3-next.0

## 0.1.36

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.1

## 0.1.36-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.1-next.1

## 0.1.36-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.1-next.0

## 0.1.35

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.0

## 0.1.35-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.0-next.2

## 0.1.35-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.0-next.1

## 0.1.35-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.0-next.0

## 0.1.33

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.9

## 0.1.33-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.9-next.3

## 0.1.33-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.9-next.2

## 0.1.33-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.9-next.1

## 0.1.33-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.9-next.0

## 0.1.32

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.8

## 0.1.32-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.8-next.1

## 0.1.31-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.7-next.0

## 0.1.29

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/plugin-events-node@0.3.5

## 0.1.29-next.2

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/plugin-events-node@0.3.5-next.2

## 0.1.29-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.5-next.1

## 0.1.29-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.5-next.0

## 0.1.28

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.4

## 0.1.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.4-next.1

## 0.1.28-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.4-next.0

## 0.1.27

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.3

## 0.1.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.3-next.1

## 0.1.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.3-next.0

## 0.1.26

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.2

## 0.1.25

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.1

## 0.1.24

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
  - @backstage/plugin-events-node@0.3.0

## 0.1.24-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.0-next.2

## 0.1.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.0-next.1

## 0.1.23-next.0

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
  - @backstage/plugin-events-node@0.3.0-next.0

## 0.1.20

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.19

## 0.1.20-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.19-next.3

## 0.1.20-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.19-next.2

## 0.1.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.19-next.1

## 0.1.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.19-next.0

## 0.1.19

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.18

## 0.1.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.18-next.2

## 0.1.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.18-next.1

## 0.1.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.18-next.0

## 0.1.18

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.17

## 0.1.18-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.17-next.3

## 0.1.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.17-next.2

## 0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.17-next.1

## 0.1.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.17-next.0

## 0.1.17

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.16

## 0.1.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.16-next.2

## 0.1.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.16-next.1

## 0.1.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.16-next.0

## 0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.15

## 0.1.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.15-next.2

## 0.1.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.14-next.1

## 0.1.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.14-next.0

## 0.1.13

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.12

## 0.1.13-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.12-next.3

## 0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.12-next.2

## 0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.12-next.1

## 0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.11-next.0

## 0.1.10

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/plugin-events-node@0.2.9

## 0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.9-next.2

## 0.1.10-next.1

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/plugin-events-node@0.2.9-next.1

## 0.1.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.9-next.0

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.8

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.8-next.0

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.7

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.7-next.2

## 0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.7-next.1

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.7-next.0

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.6

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.6-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.6-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.5

## 0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.5-next.2

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.5-next.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.5-next.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.4

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.4-next.2

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.4-next.1

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.4-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.3

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.3-next.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.3-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.3-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.1

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.1-next.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.1-next.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.0

## 0.1.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.0-next.3

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.0-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.0-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.0-next.0

## 0.1.0

### Minor Changes

- 7bbd2403a1: Adds a new backend plugin plugin-events-backend for managing events.

  plugin-events-node exposes interfaces which can be used by modules.

  plugin-events-backend-test-utils provides utilities which can be used while writing tests e.g. for modules.

  Please find more information at
  https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.1.0
