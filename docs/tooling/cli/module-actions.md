---
id: module-actions
title: Actions Module
description: CLI commands for discovering and executing Backstage actions.
---

The actions module (`@backstage/cli-module-actions`) lets you discover and run
Backstage actions from the command line, without going through the Backstage UI.

For a list of actions that Backstage plugins can expose, see the
[Well-Known Actions](../../ai/well-known-actions.md) documentation.

## Prerequisites

Before using actions commands you must authenticate with a Backstage instance
using [`auth login`](./module-auth.md#auth-login). Actions commands use the
stored credentials to communicate with the backend.

All actions commands operate against the selected instance by default.
If you have multiple authenticated instances, use the `--instance` flag with the
instance name to target a specific one. See
[Instance Names](./module-auth.md#instance-names) for details on how instance
names work.

## Plugin sources

The actions module needs to know which backend plugins to discover actions from.
These are called **plugin sources** and are stored as metadata on the
authenticated instance. You manage plugin sources with the `actions sources`
commands before listing or executing actions.

## actions list

List available actions from all configured plugin sources.

```text
Usage: backstage-cli actions list [options]

List available actions from configured plugin sources

Options:
  --instance <name>    Instance name to use (defaults to the selected instance)
```

If no plugin sources are configured, the command prints a hint to add sources
with `actions sources add`.

### Examples

List all available actions:

```bash
yarn backstage-cli actions list
```

List actions from a named instance:

```bash
yarn backstage-cli actions list --instance production
```

## actions execute

Execute an action. The action ID follows the format `<pluginId>:<actionName>`.

```text
Usage: backstage-cli actions execute [options] <action-id>

Execute an action

Options:
  --instance <name>    Instance name to use (defaults to the selected instance)
```

In addition to the `--instance` flag, the command dynamically generates flags
from the action's input JSON Schema. Each property in the schema becomes a CLI
flag with automatic type mapping:

- `string` properties become `String` flags
- `number` and `integer` properties become `Number` flags
- `boolean` properties become `Boolean` flags
- Complex types (objects, arrays, unions) become `String` flags that accept JSON
  input

Use `--help` with an action ID to see the full set of flags available for that
action, including a rendered description.

### Examples

Show help for a specific action, including its dynamically generated flags:

```bash
yarn backstage-cli actions execute my-plugin:my-action --help
```

Execute an action with flags:

```bash
yarn backstage-cli actions execute my-plugin:create-resource --name my-resource --count 3
```

Pass complex input as a JSON string:

```bash
yarn backstage-cli actions execute my-plugin:configure --options '{"timeout": 30, "retries": 3}'
```

## actions sources add

Add one or more plugin sources for action discovery. Plugin sources are stored as
metadata on the authenticated instance.

```text
Usage: backstage-cli actions sources add <plugin-ids...>

Add a plugin source for action discovery
```

If a plugin source is already configured, it is skipped with a warning.

### Examples

Add a single plugin source:

```bash
yarn backstage-cli actions sources add scaffolder
```

Add multiple plugin sources at once:

```bash
yarn backstage-cli actions sources add scaffolder catalog
```

## actions sources list

List all configured plugin sources for the current instance.

```text
Usage: backstage-cli actions sources list

List configured plugin sources
```

### Examples

```bash
yarn backstage-cli actions sources list
```

## actions sources remove

Remove one or more plugin sources from the current instance.

```text
Usage: backstage-cli actions sources remove <plugin-ids...>

Remove a plugin source
```

If a plugin source is not configured, it is skipped with a warning.

### Examples

Remove a single plugin source:

```bash
yarn backstage-cli actions sources remove scaffolder
```

Remove multiple plugin sources at once:

```bash
yarn backstage-cli actions sources remove scaffolder catalog
```

## Workflow example

A typical workflow looks like this:

```bash
# 1. Log in to your Backstage instance
yarn backstage-cli auth login --backendUrl https://backstage.example.com

# 2. Add plugin sources to discover actions from
yarn backstage-cli actions sources add scaffolder

# 3. List available actions
yarn backstage-cli actions list

# 4. Get help for a specific action
yarn backstage-cli actions execute scaffolder:create-component --help

# 5. Execute the action
yarn backstage-cli actions execute scaffolder:create-component --name my-service --owner team-a
```

---

## Intent-based commands

The following commands provide a domain-oriented interface on top of the action
framework. They call the same backend actions as `actions execute` but with
simpler flags and formatted output.

All intent-based commands support `--output json` for machine-readable output
and `--instance <name>` to target a specific authenticated instance.

### catalog list

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

```bash
# List all Components
yarn backstage-cli catalog list --kind Component

# List only service-type Components
yarn backstage-cli catalog list --kind Component --type service

# Advanced query
yarn backstage-cli catalog list --filter '{"kind":"Component","spec.lifecycle":"production"}'
```

### catalog get

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

```bash
yarn backstage-cli catalog get --name my-service --kind Component
```

### catalog validate

Validate entity YAML content against the catalog schema.

```text
Usage: backstage-cli catalog validate [options]

Options:
  --entity <yaml>      Entity YAML content (required)
  --location <url>     Location to validate
  --instance <name>    Instance name
```

Wraps `catalog:validate-entity`.

```bash
yarn backstage-cli catalog validate --entity "$(cat catalog-info.yaml)"
```

### catalog register

Register a catalog entity from a location URL.

```text
Usage: backstage-cli catalog register [options]

Options:
  --location-url <url>   URL to the catalog-info.yaml file (required)
  --instance <name>      Instance name
```

Wraps `catalog:register-entity`.

```bash
yarn backstage-cli catalog register --location-url https://github.com/org/repo/blob/main/catalog-info.yaml
```

### catalog unregister

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

### api list

List API entities in the catalog.

```text
Usage: backstage-cli api list [options]

Options:
  --type <type>        API type (openapi, asyncapi, graphql, grpc)
  --limit <number>     Maximum results to return
  --output <format>    Output format: human (default), json
  --instance <name>    Instance name
```

Wraps `catalog:query-catalog-entities` with `kind=API`.

```bash
# List all APIs
yarn backstage-cli api list

# List only OpenAPI specs
yarn backstage-cli api list --type openapi
```

### api get-spec

Get the full API specification content.

```text
Usage: backstage-cli api get-spec [options]

Options:
  --name <name>        API entity name (required)
  --namespace <ns>     Entity namespace (default: default)
  --output <format>    Output format: human (default), json
  --instance <name>    Instance name
```

Wraps `catalog:get-catalog-entity` with `kind=API` and extracts
`spec.definition`. In human mode, prints the raw spec content (OpenAPI YAML,
GraphQL SDL, protobuf, etc.). In JSON mode, returns
`{name, type, definition}`.

```bash
# Print a GraphQL schema
yarn backstage-cli api get-spec --name my-graphql-api

# Get as structured JSON
yarn backstage-cli api get-spec --name my-api --output json
```

### search

Search across all content types.

```text
Usage: backstage-cli search <term> [options]

Options:
  --types <json>          Document types (JSON array, e.g. '["techdocs"]')
  --filters <json>        Query filters (JSON)
  --page-limit <number>   Results per page (default: 10)
  --page-cursor <cursor>  Pagination cursor
  --output <format>       Output format: human (default), json
  --instance <name>       Instance name
```

Wraps `search:query`. Searches across catalog entities, TechDocs, and
templates.

```bash
yarn backstage-cli search "deployment guide"
yarn backstage-cli search "auth" --types '["techdocs"]'
```

### docs search

Search TechDocs content specifically.

```text
Usage: backstage-cli docs search <term> [options]

Options:
  --page-limit <number>   Results per page (default: 10)
  --page-cursor <cursor>  Pagination cursor
  --output <format>       Output format: human (default), json
  --instance <name>       Instance name
```

Wraps `search:query` with `types=["techdocs"]` automatically applied.

```bash
yarn backstage-cli docs search "getting started"
```

### template list

List available software templates.

```text
Usage: backstage-cli template list [options]

Options:
  --limit <number>     Maximum results to return
  --output <format>    Output format: human (default), json
  --instance <name>    Instance name
```

Wraps `catalog:query-catalog-entities` with `kind=Template`.

```bash
yarn backstage-cli template list
```

### template execute

Execute a software template.

```text
Usage: backstage-cli template execute [options]

Options:
  --template-ref <ref>   Template entity ref, e.g. template:default/my-template (required)
  --values <json>        Template input values (JSON string, required)
  --secrets <json>       Template secrets (JSON string)
  --instance <name>      Instance name
```

Wraps `scaffolder:execute-template`. Returns a `taskId` for tracking progress.

```bash
yarn backstage-cli template execute \
  --template-ref template:default/springboot \
  --values '{"name":"my-app","owner":"team-a"}'
```

### template dry-run

Validate a software template without making changes.

```text
Usage: backstage-cli template dry-run [options]

Options:
  --template-ref <ref>   Template entity ref, e.g. template:default/my-template (required)
  --values <json>        Template input values (JSON string)
  --instance <name>      Instance name
```

Wraps `scaffolder:dry-run-template`.

```bash
yarn backstage-cli template dry-run --template-ref template:default/springboot
```
