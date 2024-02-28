---
'@backstage/plugin-events-backend-test-utils': patch
'@backstage/plugin-events-backend': patch
'@backstage/plugin-events-node': patch
---

Add new `EventsService` as well as `eventsServiceRef` for the new backend system.

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
