---
id: module-scaffolder
title: Scaffolder Module
description: CLI commands for listing and executing software templates.
---

The scaffolder module (`@backstage/cli-module-scaffolder`) provides intent-based
commands for working with software templates, including repeatable
`--value key=value` and `--secret key=value` inputs.

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
  --filter <key=value> Query predicate (repeatable)
  --limit <number>     Maximum results to return
  --output <format>    Output format: human (default), json
  --instance <name>    Instance name
```

Wraps `catalog:query-catalog-entities` with `kind=Template`.

### Examples

```bash
yarn backstage-cli template list
yarn backstage-cli template list --filter metadata.tags=nodejs
```

## template execute

Execute a software template.

```text
Usage: backstage-cli template execute [ref] [options]

Options:
  --template-ref <ref>   Template entity reference alias
  --namespace <ns>       Template namespace for a short reference
  --value <key=value>    Template input value (repeatable)
  --secret <key=value>   Template secret (repeatable)
  --output <format>      Output format: human (default), json
  --instance <name>      Instance name
```

Wraps `scaffolder:execute-template`. Returns a `taskId` for tracking progress.
Input values and secrets are optional. Repeat `--value` or `--secret` to provide
multiple inputs.

### Examples

```bash
yarn backstage-cli template execute \
  template:default/springboot \
  --value name=my-app \
  --value owner=team-a
```

## template dry-run

Validate a software template without making changes.

```text
Usage: backstage-cli template dry-run [options]

Options:
  --template-file <path> Path to a template YAML file
  --template-ref <yaml>  Inline template YAML content alias
  --value <key=value>    Template input value (repeatable)
  --output <format>      Output format: human (default), json
  --instance <name>      Instance name
```

Wraps `scaffolder:dry-run-template`.

### Examples

```bash
yarn backstage-cli template dry-run \
  --template-file ./template.yaml \
  --value name=my-app

# Existing inline YAML input remains supported
yarn backstage-cli template dry-run \
  --template-ref "$(cat template.yaml)" \
  --value name=my-app
```
