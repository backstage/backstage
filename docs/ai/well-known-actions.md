---
id: well-known-actions
title: Well-known Actions
description: This section lists a number of well known actions that are a part of the action registry.
---

This section lists a number of well known [Actions](../backend-system/core-services/actions.md) registered with the [Actions Registry](../backend-system/core-services/actions-registry.md).

## Actions

This is a (non-exhaustive) list of actions that are known to be part of the actions registry. Entries are in the format: "`action-name` (Action Title): Shortened Action Description"

### Auth

- `who-am-i` (Who Am I): Returns the catalog entity and user info for the currently authenticated user. This action requires user credentials and cannot be used with service or unauthenticated credentials.

### Catalog

- `get-catalog-entity` (Get Catalog Entity): This allows you to get a single entity from the software catalog.
- `query-catalog-entities` (Query Catalog Entities): Query entities from the Backstage Software Catalog using predicate filters.
- `register-entity` (Register entity in the Catalog): Registers one or more entities in the Backstage catalog by creating a Location entity that points to a remote `catalog-info.yaml` file.
- `unregister-entity` (Unregister entity from the Catalog): Unregisters a Location entity and all entities it owns from the Backstage catalog.
- `validate-entity` (Validate Catalog Entity): This action can be used to validate `catalog-info.yaml` file contents meant to be used with the software catalog.

### Scaffolder

- `dry-run-template` (Dry Run Scaffolder Template): Dry-runs a scaffolder template to validate it without making changes. Returns success with execution logs, or errors for validation failures.
- `list-scaffolder-actions` (List Scaffolder Actions): Lists all installed Scaffolder actions.
- `list-scaffolder-tasks` (List Scaffolder Tasks): This allows you to list scaffolder tasks that have been created.
