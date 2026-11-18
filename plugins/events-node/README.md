# `@backstage/plugin-events-node`

This package defined basic types for event-based interactions inside of Backstage.

Additionally, it provides the core event service `eventsServiceRef` of type `EventsService`
with its default implementation that uses the `DefaultEventsService` implementation.

`DefaultEventsService` is a simple in-memory implementation
that requires the co-deployment of producers and consumers of events.

## Installation

Add `@backstage/plugin-events-node` as dependency to your plugin or plugin module package
to which you want to add event support.

```bash
yarn --cwd plugins/<your-plugin> add @backstage/plugin-events-node
```

## Documentation

See [Events Service](https://backstage.io/docs/backend-system/core-services/events)
for usage, configuration, how to replace the service implementation, and legacy
backend system setup.
