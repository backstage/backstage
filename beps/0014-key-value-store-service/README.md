---
title: Key-Value Store Service
status: provisional
authors:
  - '@mtlewis'
owners:
  - '@mtlewis'
project-areas:
  - core-framework
creation-date: 2026-06-11
---

# BEP: Key-Value Store Service

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
  - [Service Interface](#service-interface)
  - [Schema-Validated Namespaces](#schema-validated-namespaces)
  - [Etag and Compare-and-Swap](#etag-and-compare-and-swap)
  - [Change Notifications via EventsService](#change-notifications-via-eventsservice)
  - [Database Schema](#database-schema)
  - [Namespace Key Format](#namespace-key-format)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Open Questions](#open-questions)
- [Alternatives](#alternatives)

## Summary

Add a new `KeyValueStoreService` to Backstage's core backend services, giving plugins a persistent, schema-validated key-value store backed by the plugin's own database. The service eliminates the need for plugins to write custom migrations, table schemas, and SQL when they just need to store simple structured data. All access goes through Zod-validated namespaces, which provide type safety, etag-based compare-and-swap for concurrent writes, and change notifications via the EventsService.

## Motivation

Backend plugins that need to persist small amounts of structured data currently have two options:

- **DatabaseService**: Full Knex access with custom migrations. Powerful but heavyweight — plugins must author migration files, define table schemas, and write raw queries even for trivial storage needs.
- **CacheService**: Lightweight key-value API, but ephemeral and TTL-based. Not suitable for data that must survive restarts or cache eviction.

There is no middle ground. A plugin that wants to store a configuration object, a set of user preferences, or a small state machine must take on the full complexity of the database service. This discourages plugins from persisting data that would improve the user experience, and leads to repeated boilerplate across the ecosystem.

### Goals

- Provide a zero-setup persistent key-value store as a core backend service
- Enforce schema validation on all reads and writes via Zod, with type inference
- Enable seamless data migration through Zod schema defaults and transforms
- Support optimistic concurrency control via etag-based compare-and-swap
- Enable reactive patterns through EventsService-backed change notifications
- Follow established Backstage service conventions (plugin-scoped, database-backed, factory pattern)

### Non-Goals

- Replacing the DatabaseService for plugins with relational data needs
- Cross-plugin data sharing — each plugin's store is isolated to its own database
- TTL or automatic expiration of entries (CacheService already covers this)

## Proposal

Introduce a new plugin-scoped core service, `coreServices.keyValueStore`, with a default implementation in `@backstage/backend-defaults`. The service manages a single database table within each plugin's database namespace and exposes it through typed, schema-validated namespaces.

Plugins obtain a namespace by calling `withSchema()`, passing a namespace name and a Zod schema. The namespace provides `get`, `set`, `delete`, `list`, and `subscribe` methods, all typed according to the schema. Values are parsed through the schema on both read and write — on read, this applies defaults and transforms that can migrate old data shapes forward without manual migration steps.

Each stored value carries an etag derived from its content hash. Passing an etag to `set()` makes the write conditional (compare-and-swap), throwing a `ConflictError` if the value has changed since it was read. This enables safe concurrent updates without requiring database-level transactions in plugin code.

Change notifications are published through the Backstage EventsService whenever a key is set or deleted.

## Design Details

### Service Interface

The top-level service is a factory for typed namespaces:

```ts
import { z } from 'zod/v4';

interface KeyValueStoreService {
  withSchema<TSchema extends z.ZodType>(options: {
    namespace: string; // must match [a-z0-9-]+
    schema: TSchema;
  }): KeyValueStoreNamespace<z.input<TSchema>, z.output<TSchema>>;
}
```

### Schema-Validated Namespaces

Each namespace is fully typed by its Zod schema. `set()` accepts values matching the schema input type (allowing omission of fields with defaults), while `get()` and `list()` return the output type (after defaults and transforms are applied).

```ts
interface KeyValueStoreNamespace<TInput, TOutput> {
  get(key: string): Promise<{ value: TOutput; etag: string } | undefined>;
  set(
    key: string,
    value: TInput,
    options?: { etag?: string },
  ): Promise<{ etag: string }>;
  delete(key: string): Promise<void>;
  list(): Promise<Array<{ key: string; value: TOutput; etag: string }>>;
  subscribe(subscriber: {
    id: string;
    onEvent: (event: KeyValueStoreChangeEvent) => Promise<void>;
  }): Promise<{ unsubscribe: () => void }>;
}
```

Schema migration example — adding a field with a default to an existing namespace:

```ts
// v1: original schema
const ns = keyValueStore.withSchema({
  namespace: 'my-feature',
  schema: z.object({ count: z.number() }),
});
await ns.set('item', { count: 5 });

// v2: add a field with a default — old entries auto-migrate on read
const ns = keyValueStore.withSchema({
  namespace: 'my-feature',
  schema: z.object({
    count: z.number(),
    label: z.string().default('untitled'),
  }),
});
const result = await ns.get('item');
// result.value is { count: 5, label: 'untitled' }
```

### Etag and Compare-and-Swap

Every stored value has an etag computed as the SHA-256 hash of the serialized JSON. The etag is returned by `get()`, `set()`, and `list()`, and can be passed back to `set()` for conditional writes:

```ts
const entry = await ns.get('config');
// entry = { value: { ... }, etag: 'abc123' }

// Conditional write — succeeds only if the value hasn't changed
await ns.set('config', newValue, { etag: entry.etag });

// If another writer changed the value, this throws ConflictError
```

When an etag is provided, the write executes within a database transaction: read the current value, compare hashes, and update only if they match. Without an etag, the write is an unconditional upsert.

### Change Notifications via EventsService

The service publishes events through the Backstage EventsService on every `set()` and `delete()` operation. Events are published to a topic scoped to the plugin and namespace: `keyValueStore.<pluginId>.<namespace>`.

```ts
type KeyValueStoreChangeEvent = {
  namespace: string;
  key: string;
  action: 'set' | 'delete';
  etag?: string; // present for 'set', absent for 'delete'
};
```

Namespaces expose a `subscribe()` method that wraps the EventsService subscription, following the convention established by `CatalogScmEventsService`:

```ts
const { unsubscribe } = await ns.subscribe({
  id: 'my-subscriber',
  onEvent: async event => {
    if (event.action === 'set') {
      const latest = await ns.get(event.key);
      // react to the change
    }
  },
});
```

The EventsService dependency is optional in the implementation. When absent, `set()` and `delete()` silently skip publishing, while `subscribe()` throws an error.

### Database Schema

A single table is created in each plugin's database via Knex migrations:

| Column       | Type         | Description                              |
| ------------ | ------------ | ---------------------------------------- |
| `key`        | VARCHAR(255) | Primary key. Stores `<namespace>/<key>`. |
| `value`      | TEXT         | JSON-serialized value.                   |
| `updated_at` | DATETIME     | Timestamp of the last write.             |

Table name: `backstage_backend_key_value_store__entries`
Migration table: `backstage_backend_key_value_store__knex_migrations`

### Namespace Key Format

Keys are stored in the database as `<namespace>/<key>` to isolate namespaces within a single table. The namespace prefix is stripped when returning keys to callers. The `LIKE '<namespace>/%'` query pattern is used for `list()`.

## Release Plan

1. Release the service under `@alpha` in `@backstage/backend-plugin-api` and `@backstage/backend-defaults`.
2. Add `mockServices.keyValueStore` to `@backstage/backend-test-utils`.
3. Add documentation to the core services docs.
4. Gather feedback from early adopters and iterate on the API surface.
5. Promote to `@public` once the API surface is stable.

## Dependencies

- **DatabaseService** (`coreServices.database`): provides the per-plugin Knex client and migration support.
- **EventsService** (`@backstage/plugin-events-node`): used for publishing change notifications.
- **Zod** (`zod/v4`): used for schema validation and type inference.

## Open Questions

### Querying beyond key lookup

The current design only supports fetching entries by exact key or listing all entries in a namespace. There are several options for richer querying:

1. **Key-based queries**: Allow filtering by key prefix or pattern. Simple to implement but unlikely to address many real-world use cases.
2. **Value-based queries**: Allow arbitrary queries against the shape of the stored JSON values. More powerful but significantly more complex — would require a query DSL or structured filter syntax, and performant implementation may depend on database-specific JSON querying capabilities.
3. **Entity ref association**: Add an optional `entityRef` to each row and allow querying entries by entity ref. This aligns well with Backstage's entity-centric model and would cover a common use case where plugins store data associated with catalog entities.

## Alternatives

### Use the CacheService with no TTL

The CacheService can technically persist data indefinitely when no TTL is set. However, it is backed by external stores (Redis, Memcache) or in-memory storage, none of which guarantee durability. Cache stores may evict entries under memory pressure, and in-memory data is lost on restart.

### Extend the DatabaseService with a helper

A utility function on top of DatabaseService could provide a simpler key-value API while reusing existing migrations infrastructure. This was considered but rejected because it would still require each plugin to manage its own migration files and table definitions, which is the primary pain point this service addresses.
