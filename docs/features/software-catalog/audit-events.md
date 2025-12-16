---
id: audit-events
title: Audit Events
description: Tracking access to your Software Catalog.
---

The Catalog backend emits audit events for various operations. Events are grouped logically by `eventId`, with `subEventId` providing further distinction within an operation group.

## Entity Events

- **`entity-fetch`**: Retrieves entities.
- **Note:** By default, "low" severity audit events like `entity-fetch` aren't logged because they map to the "debug" level, while Backstage defaults to "info" level logging. To see `entity-fetch` events, update your `app-config.yaml` by setting `backend.auditor.severityLogLevelMappings.low: info`. See the [Auditor Service documentation](https://backstage.io/docs/backend-system/core-services/auditor/#severity-levels-and-default-mappings) for details on severity mappings.

  Filter on `queryType`.

  - **`all`**: Fetching all entities. (GET `/entities`)
  - **`by-id`**: Fetching a single entity using its UID. (GET `/entities/by-uid/:uid`)
  - **`by-name`**: Fetching a single entity using its kind, namespace, and name. (GET `/entities/by-name/:kind/:namespace/:name`)
  - **`by-query`**: Fetching multiple entities using a filter query. (GET `/entities/by-query`)
  - **`by-refs`**: Fetching a batch of entities by their entity refs. (POST `/entities/by-refs`)
  - **`ancestry`**: Fetching the ancestry of an entity. (GET `/entities/by-name/:kind/:namespace/:name/ancestry`)

- **`entity-mutate`**: Modifies entities.

  Filter on `actionType`.

  - **`delete`**: Deleting a single entity. Note: this will not be a permanent deletion and the entity will be restored if the parent location is still present in the catalog. (DELETE `/entities/by-uid/:uid`)
  - **`refresh`**: Scheduling an entity refresh. (POST `/entities/refresh`)

- **`entity-validate`**: Validates an entity. (POST `/entities/validate`)

- **`entity-facets`**: Retrieves entity facets. (GET `/entity-facets`)

## Location Events

- **`location-fetch`**: Retrieves locations.

  Filter on `actionType`.

  - **`all`**: Fetching all locations. (GET `/locations`)
  - **`by-id`**: Fetching a single location by ID. (GET `/locations/:id`)
  - **`by-entity`**: Fetching locations associated with an entity ref. (GET `/locations/by-entity`)

- **`location-mutate`**: Modifies locations.

  - **`create`**: Creating a new location. (POST `/locations`)
  - **`delete`**: Deleting a location and its associated entities. (DELETE `/locations/:id`)

- **`location-analyze`**: Analyzes a location. (POST `/locations/analyze`)
