---
id: module-scaffolder
title: Scaffolder Module
description: CLI commands for listing and executing software templates.
---

The scaffolder module (`@backstage/cli-module-scaffolder`) provides intent-based
commands for working with software templates. Instead of calling
`actions execute scaffolder:execute-template --templateRef ... --values ...`,
you can use `template execute --template-ref ... --values ...`.

## Prerequisites

Before using template commands you must authenticate with a Backstage instance
using [`auth login`](./module-auth.md#auth-login) and register the `catalog`
and `scaffolder` plugin sources using
[`actions sources add`](./module-actions.md#actions-sources-add).

All commands support `--output json` for machine-readable output and
`--instance <name>` to target a specific authenticated instance.

## template list

List available software templates.

```text
Usage: backstage-cli template list [options]

Options:
  --limit <number>     Maximum results to return
  --output <format>    Output format: human (default), json
  --instance <name>    Instance name
```

Wraps `catalog:query-catalog-entities` with `kind=Template`.

### Examples

```bash
yarn backstage-cli template list
```

## template execute

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

### Examples

```bash
yarn backstage-cli template execute \
  --template-ref template:default/springboot \
  --values '{"name":"my-app","owner":"team-a"}'
```

## template dry-run

Validate a software template without making changes.

```text
Usage: backstage-cli template dry-run [options]

Options:
  --template-ref <ref>   Template entity ref, e.g. template:default/my-template (required)
  --values <json>        Template input values (JSON string)
  --instance <name>      Instance name
```

Wraps `scaffolder:dry-run-template`.

### Examples

```bash
yarn backstage-cli template dry-run --template-ref template:default/springboot
```
