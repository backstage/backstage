---
id: well-known-actions
title: Well-known Actions
description: This section lists a number of well-known actions that are part of the Actions Registry.
---

This section lists a number of well-known [Actions](../backend-system/core-services/actions.md) registered with the [Actions Registry](../backend-system/core-services/actions-registry.md).

## Actions

This is a (non-exhaustive) list of actions that are known to be part of the Actions Registry. Entries are in the format: "`action-name` (Action Title): Shortened Action Description"

### Auth

- `auth.who-am-i` (Who Am I): Returns the catalog entity and user info for the currently authenticated user. This action requires user credentials and cannot be used with service or unauthenticated credentials.

### Catalog

- `catalog.get-catalog-entity` (Get Catalog Entity): This allows you to get a single entity from the software catalog.
- `catalog.query-catalog-entities` (Query Catalog Entities): Query entities from the Backstage Software Catalog using predicate filters.
- `catalog.register-entity` (Register entity in the Catalog): Registers one or more entities in the Backstage catalog by creating a Location entity that points to a remote `catalog-info.yaml` file.
- `catalog.unregister-entity` (Unregister entity from the Catalog): Unregisters a Location entity and all entities it owns from the Backstage catalog.
- `catalog.validate-entity` (Validate Catalog Entity): This action can be used to validate `catalog-info.yaml` file contents meant to be used with the software catalog.

### Scaffolder

- `scaffolder.dry-run-template` (Dry Run Scaffolder Template): Dry-runs a scaffolder template to validate it without making changes. Returns success with execution logs, or errors for validation failures.
- `scaffolder.list-scaffolder-actions` (List Scaffolder Actions): Lists all installed Scaffolder actions.
- `scaffolder.list-scaffolder-tasks` (List Scaffolder Tasks): This allows you to list scaffolder tasks that have been created.
- `scaffolder.get-scaffolder-task-logs` (Get Scaffolder Task Logs): This allows you to fetch the logs of a given scaffolder task.
