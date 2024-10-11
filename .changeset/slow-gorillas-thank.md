---
'@backstage/plugin-events-backend': patch
---

The events backend now has its own built-in event bus for distributing events across multiple backend instances. It exposes a new HTTP API under `/bus/v1/` for publishing and reading events from the bus, as well as its own storage and notification mechanism for events.

The backing event store for the bus only supports scaled deployment if PostgreSQL is used as the DBMS. If SQLite or MySQL is used, the event bus will fall back to an in-memory store that does not support multiple backend instances.

The default `EventsService` implementation from `@backstage/plugin-events-node` has also been updated to use the new events bus.
