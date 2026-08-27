---
id: module-search
title: Search Module
description: CLI commands for searching Backstage content.
---

The search module (`@backstage/cli-module-search`) provides intent-based
commands for searching across Backstage content. Instead of calling
`actions execute search:query --term "my service" --types '["techdocs"]'`,
you can use `docs search "my service"`.

## Prerequisites

Before using search commands you must authenticate with a Backstage instance
using [`auth login`](./module-auth.md#auth-login) and register the `search`
plugin source using [`actions sources add search`](./module-actions.md#actions-sources-add).

All commands support `--output json` for machine-readable output and
`--instance <name>` to target a specific authenticated instance.

## search

Search across all content types (catalog entities, TechDocs, templates).

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

Wraps `search:query`.

### Examples

```bash
yarn backstage-cli search "deployment guide"
yarn backstage-cli search "auth" --types '["techdocs"]'
```

## docs search

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

### Examples

```bash
yarn backstage-cli docs search "getting started"
```
