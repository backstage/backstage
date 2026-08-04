---
id: module-catalog
title: Catalog Module
description: CLI commands for querying and managing the Backstage software catalog.
---

The catalog module (`@backstage/cli-module-catalog`) provides intent-based
commands for interacting with the Backstage software catalog. Instead of calling
`actions execute catalog:query-catalog-entities --query '{"kind":"Component"}'`,
you can use `catalog list --kind Component`.

## Prerequisites

Before using catalog commands you must authenticate with a Backstage instance
using [`auth login`](./module-auth.md#auth-login) and register the `catalog`
plugin source using [`actions sources add catalog`](./module-actions.md#actions-sources-add).

All commands support `--output json` for machine-readable output and
`--instance <name>` to target a specific authenticated instance.

## catalog list

List catalog entities with optional filtering.

```text
Usage: backstage-cli catalog list [options]

Options:
  --kind <kind>        Entity kind (Component, API, System, etc.)
  --type <type>        Entity type (service, website, library, etc.)
  --filter <json>      Full query predicate (JSON)
  --limit <number>     Maximum results to return
  --fields <json>      Fields to include (JSON array)
  --output <format>    Output format: human (default), json
  --instance <name>    Instance name
```

Wraps `catalog:query-catalog-entities`. The `--kind` and `--type` flags are
translated into a query predicate automatically.

### Examples

```bash
# List all Components
yarn backstage-cli catalog list --kind Component

# List only service-type Components
yarn backstage-cli catalog list --kind Component --type service

# List APIs
yarn backstage-cli catalog list --kind API

# Advanced query
yarn backstage-cli catalog list --filter '{"kind":"Component","spec.lifecycle":"production"}'
```

## catalog get

Get a single catalog entity by name.

```text
Usage: backstage-cli catalog get [options]

Options:
  --name <name>          Entity name (required)
  --kind <kind>          Entity kind
  --namespace <ns>       Entity namespace (default: default)
  --output <format>      Output format: human (default), json
  --instance <name>      Instance name
```

Wraps `catalog:get-catalog-entity`.

### Examples

```bash
yarn backstage-cli catalog get --name my-service --kind Component
```

## catalog validate

Validate entity YAML content against the catalog schema.

```text
Usage: backstage-cli catalog validate [options]

Options:
  --entity <yaml>      Entity YAML content (required)
  --location <url>     Location to validate
  --instance <name>    Instance name
```

Wraps `catalog:validate-entity`.

### Examples

```bash
yarn backstage-cli catalog validate --entity "$(cat catalog-info.yaml)"
```

## catalog register

Register a catalog entity from a location URL.

```text
Usage: backstage-cli catalog register [options]

Options:
  --location-url <url>   URL to the catalog-info.yaml file (required)
  --instance <name>      Instance name
```

Wraps `catalog:register-entity`.

### Examples

```bash
yarn backstage-cli catalog register --location-url https://github.com/org/repo/blob/main/catalog-info.yaml
```

## catalog unregister

Unregister a catalog entity by location.

```text
Usage: backstage-cli catalog unregister [options]

Options:
  --location-id <id>     Location ID to unregister
  --location-url <url>   Location URL to unregister
  --instance <name>      Instance name
```

Wraps `catalog:unregister-entity`. Provide either `--location-id` or
`--location-url`.
