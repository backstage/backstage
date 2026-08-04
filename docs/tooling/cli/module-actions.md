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
