---
id: module-search
title: Search Module
description: CLI commands for searching Backstage content.
---

The search module (`@backstage/cli-module-search`) provides intent-based
commands for searching across Backstage content, such as
`docs search "my service"`.

## Prerequisites

Before using search commands you must authenticate with a Backstage instance
using [`auth login`](./module-auth.md#auth-login) and register the `search`
plugin source using [`actions sources add search`](./module-actions.md#actions-sources-add).

All commands support `--output human|json` and `--instance <name>` to target a
specific authenticated instance. Unknown flags are rejected.

In human output on a terminal, the commands show how many results were found
and ask whether to show the next page. Otherwise they print the `--cursor`
value to continue from. JSON output contains a single page and
`nextPageCursor`.

## search

Search across all content types (catalog entities, TechDocs, templates).

```text
Usage: backstage-cli search <term> [options]

Options:
  --type <type>           Document type (repeatable)
  --filter <key=value>    Query filter (repeatable)
  --limit <number>        Results per page
  --cursor <cursor>       Continue from the cursor of a previous page
  --output <format>       Output format: human (default), json
  --instance <name>       Instance name
```

Repeat `--type` or `--filter` to add more.

### Examples

```bash
yarn backstage-cli search "deployment guide"
yarn backstage-cli search "auth" --type techdocs --type software-catalog
yarn backstage-cli search "service" --filter kind=Component --filter lifecycle=production
```

## docs search

Search TechDocs content specifically.

```text
Usage: backstage-cli docs search <term> [options]

Options:
  --limit <number>        Results per page
  --cursor <cursor>       Continue from the cursor of a previous page
  --output <format>       Output format: human (default), json
  --instance <name>       Instance name
```

Only TechDocs content is searched.

### Examples

```bash
yarn backstage-cli docs search "getting started"
```
