---
id: auditor
title: Auditor Service
sidebar_label: Auditor
description: Documentation for the Auditor service
---

## Overview

This document describes the Auditor Service, a core service designed to record and report on security-relevant events within an application. By default, this service utilizes the `rootLogger` core service for logging.

## Key Features

- Provides a standardized way to capture security events.
- Allows categorization of events by severity level.
- Supports detailed metadata for each event.
- Offers success/failure reporting for events.
- Integrates with authentication and plugin services for enhanced context.
- Provides a service factory for easy integration with Backstage plugins.

## How it Works

The Auditor Service defines a class, `Auditor`, which implements the `AuditorService` interface. This class uses a `logFn` to log audit events with varying levels of severity and associated metadata. It also integrates with authentication and plugin services to capture actor details and plugin context.

The `auditorServiceFactory` wraps the `rootLogger` core service and provides a factory function for creating child loggers for individual plugins. This allows each plugin to have its own logger with inherited and additional metadata.

## Usage Guidance

The Auditor Service is designed for recording security-relevant events that require special attention or are subject to compliance regulations. These events often involve actions like:

- User session management
- Data access and modification
- System configuration changes

For general application logging that is not security-critical, you should use the standard `LoggerService` provided by Backstage. This helps to keep your audit logs focused and relevant.

## Using the Service

The Auditor Service can be accessed via dependency injection in your Backstage plugin. Here's an example of how to access the service and create an audit event within an Express route handler:

```typescript
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { auditor } = options;

  const router = Router();
  router.use(express.json());

  router.post('/my-endpoint', async (req, res) => {
    const auditorEvent = await auditor.createEvent({
      eventId: 'my-endpoint-call',
      request: req,
      meta: {
        // ... metadata about the request
      },
    });

    try {
      // ... process the request

      await auditorEvent.success();
      res.status(200).json({ message: 'Succeeded!' });
    } catch (error) {
      await auditorEvent.fail({ error });
      res.status(500).json({ message: 'Failed!' });
      throw error;
    }
  });

  return router;
}
```

In this example, an audit event is created for each request to `/my-endpoint`. The `success` or `fail` methods are called based on the outcome of processing the request.

## Naming Conventions

When defining audit events, follow these guidelines to ensure consistency and clarity:

- **Use kebab-case:** Event IDs should be in kebab-case (e.g., `user-session`, `file-download`, `entity-fetch`).
- **`eventId` for Logical Grouping:** The `eventId` represents a broad category or logical group of related operations. For example, `entity-fetch` would group all entity retrieval events. `location-mutate` would group all actions that mutate a location.
- **`meta.queryType` (or related field) for Specific Actions within a Group:** Use a `meta` field (like `queryType`, `actionType` or similar) to specify the particular action or query that occurred within the broader `eventId` group.
  - For instance, with `eventId: entity-fetch`, use `meta: { queryType: 'by-id' }` to represent fetching an entity by its ID. Other examples could be:
    - `meta: { queryType: 'all' }` for fetching all entities.
    - `meta: { queryType: 'by-query' }` for fetching entities by a query.
    - `meta: { actionType: 'delete' }` for `eventId: entity-mutate` when an entity was deleted.
    - `meta: { actionType: 'create' }` for `eventId: location-mutate` when a location was added.
  - Use `meta` fields to add more context to the event being tracked.
- **Avoid Redundant Prefixes:** Do not include redundant prefixes related to the plugin ID in your event names. The plugin context is already provided separately.
- **Clear and Concise:** Choose names that clearly and concisely describe the event being audited.

## Common Meta Keys and Values

The following table details common keys found within the `meta` object of audit events and their formats:

| Key           | Description                                                                    | Format                                | Example(s)                                                                |
| ------------- | ------------------------------------------------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------- |
| `queryType`   | Specifies the type of query performed when fetching data.                      | A kebab-case string                   | `all`, `by-id`, `by-name`, `by-query`, `by-refs`, `ancestry`, `by-entity` |
| `actionType`  | Specifies the type of action performed when modifying data.                    | A kebab-case string                   | `create`, `delete`, `refresh`                                             |
| `entityRef`   | The full reference of an entity, including kind, namespace, and name.          | `[kind]:[namespace]/[name]`           | `component:default/my-component`, `group:my-org/team-a`                   |
| `locationRef` | A specific reference to a location being operated on.                          | Any string representing the location. | `url:https://example.com/catalog-info.yaml`, `custom:default/my-location` |
| `uid`         | The unique identifier of a location or other object involved in the operation. | Any valid unique ID string            | `9a4e740b-e557-427f-b9f2-0d4f092b1c1e`                                    |

By following these conventions, you create a more structured and informative audit trail that is easier to search, filter, and understand. This allows you to better group and understand the events being logged.

## Audit Event Examples

To illustrate how these naming conventions and the meta field are used in practice, the following examples demonstrate typical audit events for common operations.

**Typical Read Operation Example:**

For an operation that fetches all entities, a typical audit event would look like this:

```json
{
  "eventId": "entity-fetch",
  "meta": {
    "queryType": "all"
  }
  ...
}
```

**Typical Write Operation Example:**

For an operation that deletes an entity, a typical audit event would look like this:

```json
{
  "eventId": "entity-mutate",
  "meta": {
    "actionType": "delete",
    "uid": "some-entity-uid",
    "entityRef": "component:default/petstore"
  },
  "severityLevel": "medium"
  ...
}
```

## Practical Examples for Auditor Implementation

To clarify how to utilize the Auditor feature effectively, we recommend exploring the Catalog Backend. It offers two valuable resources:

- **Code Implementation Example (createRouter.ts):**
  - The [`createRouter.ts`](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/src/service/createRouter.ts) file within the Catalog Backend showcases a practical integration of the `AuditorService` within a Backstage backend plugin.
  - Specifically, the lines that demonstrate the creation of an audit event. This includes setting critical parameters such as `eventId` and `severityLevel`, as well as incorporating relevant metadata like `queryType` and `entityRef`.
- **Documentation Example (README.md):**
  - The "Audit Events" section of the Catalog Backend's [`README.md`](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/README.md#audit-events) provides a well-structured example of documenting emitted audit events.
  - It illustrates how to detail various `eventId` values and their corresponding `meta` fields (e.g., `queryType`, `actionType`) for different plugin operations.

These examples provide both a code-level demonstration and a documentation guideline for effectively utilizing the `AuditorService` to manage audit events within your Backstage plugins.
