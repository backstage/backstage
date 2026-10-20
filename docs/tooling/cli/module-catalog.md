---
id: module-catalog
title: Catalog Module
description: CLI commands for querying and managing the Backstage software catalog.
---

The catalog module (`@backstage/cli-module-catalog`) provides intent-based
commands for interacting with the Backstage software catalog, such as
`catalog list --kind Component`.

## Prerequisites

Before using catalog commands you must authenticate with a Backstage instance
using [`auth login`](./module-auth.md#auth-login) and register the `catalog`
plugin source using [`actions sources add catalog`](./module-actions.md#actions-sources-add).

All commands support `--instance <name>` to target a specific authenticated
instance. `catalog list` supports `--output human|json`; all other commands
always print JSON. Unknown flags are rejected.

## catalog list

List catalog entities with optional filtering.

```text
Usage: backstage-cli catalog list [options]

Options:
  --kind <kind>        Entity kind (Component, API, System, etc.)
  --type <type>        Entity type (service, website, library, etc.)
  --filter <key=value> Query predicate (repeatable)
  --limit <number>     Maximum results to return per page
  --cursor <cursor>    Continue from the cursor of a previous page
  --fields <list>      Comma-separated fields
  --output <format>    Output format: human (default), json
  --instance <name>    Instance name
```

The `--kind` and `--type` flags are translated into a query predicate
automatically. Repeat `--filter` to add predicates. Using `--filter` with the
same key as `--kind` or `--type` is an error. `--cursor` cannot be combined with
`--kind`, `--type` or `--filter`, because the cursor already encodes the query.
Use `--fields` together with `--cursor` to keep the same field selection on
later pages.

In human output on a terminal, the command shows one page at a time with a
status line such as `Page 2 of 7`. Press the right arrow key for the next page,
the left arrow key for the previous page, and `q`, `Esc`, or `Ctrl+C` to quit.
Otherwise it prints the `--cursor` value to continue from. JSON output contains a single page and `nextPageCursor`.

### Examples

```bash
# List all Components
yarn backstage-cli catalog list --kind Component

# List only service-type Components
yarn backstage-cli catalog list --kind Component --type service

# List APIs
yarn backstage-cli catalog list --kind API

# Advanced query
yarn backstage-cli catalog list --filter kind=Component --filter spec.lifecycle=production

# Select fields for the human-readable table
yarn backstage-cli catalog list --fields metadata.name,metadata.description
```

## catalog get

Get a single catalog entity by reference. References use the
`[kind:][namespace/]name` format. Use `--kind` or `--namespace` to disambiguate
a short reference that matches multiple entities.

```text
Usage: backstage-cli catalog get <ref> [options]

Options:
  --kind <kind>          Kind to use when the reference has none
  --namespace <ns>       Namespace to use when the reference has none
  --instance <name>      Instance name
```

Using `--kind` or `--namespace` together with a reference that already contains
that part is an error.

### Examples

```bash
yarn backstage-cli catalog get component:default/my-service
yarn backstage-cli catalog get my-service --kind Component
```

## catalog validate

Validate the entities in a YAML file, or standard input, against the catalog schema. Files with multiple YAML documents separated by `---` are supported.

```text
Usage: backstage-cli catalog validate <file> [options]

Options:
  --location <url>     Location to validate
  --instance <name>    Instance name
```

Use `-` as the file to read from standard input. The results are printed as a JSON array with one result per entity, in document order. Each result has `isValid`, `isValidYaml`, and `errors` fields, and valid results also include the `entity`. `isValidYaml` is `false` only for YAML syntax errors. The command exits with code 1 if any entity is not valid, and reports an error if the input contains no entities. Connection and authentication problems are reported as errors.

### Examples

```bash
yarn backstage-cli catalog validate ./catalog-info.yaml
cat catalog-info.yaml | yarn backstage-cli catalog validate -
```

## catalog register

Register a catalog entity from a location URL.

```text
Usage: backstage-cli catalog register <url> [options]

Options:
  --instance <name>      Instance name
```

### Examples

```bash
yarn backstage-cli catalog register https://github.com/org/repo/blob/main/catalog-info.yaml
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

Provide exactly one of `--location-id` or `--location-url`.
