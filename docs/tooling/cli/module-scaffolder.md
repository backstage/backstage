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

All commands support `--instance <name>` to target a specific authenticated
instance. `template list` supports `--output human|json`; all other commands
always print JSON. Unknown flags are rejected.

## template list

List available software templates.

```text
Usage: backstage-cli template list [options]

Options:
  --filter <key=value> Query predicate (repeatable)
  --limit <number>     Maximum results to return per page
  --cursor <cursor>    Continue from the cursor of a previous page
  --output <format>    Output format: human (default), json
  --instance <name>    Instance name
```

Only entities of kind `Template` are listed, so a `kind` filter is an error. `--cursor` cannot be combined with
`--filter`, because the cursor already encodes it. Human output shows how
many templates were shown and, when more are available, prints the `--cursor`
value to continue from.

### Examples

```bash
yarn backstage-cli template list
yarn backstage-cli template list --filter metadata.tags=nodejs
```

## template execute

Execute a software template.

```text
Usage: backstage-cli template execute <ref> [options]

Options:
  --namespace <ns>       Namespace to use when the reference has none
  --value <key=value>    Template input value (repeatable)
  --secret <key=value>   Template secret (repeatable)
  --instance <name>      Instance name
```

Returns a `taskId` for tracking progress. Using `--namespace` with a reference
that already has a namespace is an error. Input values and secrets are optional. Repeat `--value` or `--secret` to provide
multiple inputs.

### Examples

```bash
yarn backstage-cli template execute \
  template:default/springboot \
  --value name=my-app \
  --value owner=team-a
```

## template dry-run

Validate a software template file, or standard input, without making changes.

```text
Usage: backstage-cli template dry-run <file> [options]

Options:
  --value <key=value>    Template input value (repeatable)
  --instance <name>      Instance name
```

Use `-` as the file to read from standard input. The result is printed as JSON, and the
command exits with code 1 if the template is not valid YAML.

### Examples

```bash
yarn backstage-cli template dry-run ./template.yaml --value name=my-app
cat template.yaml | yarn backstage-cli template dry-run - --value name=my-app
```
