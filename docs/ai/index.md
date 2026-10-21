---
id: overview
title: Overview
description: An overview of the AI features in Backstage.
---

Backstage includes support for AI coding assistants at several levels: the Software Catalog can model AI-related resources, the MCP Actions Backend exposes Backstage functionality as Model Context Protocol (MCP) tools, and published skills teach AI assistants how to perform common Backstage tasks.

## AI in the Software Catalog

You can represent AI-related resources as [entities in the Software Catalog](./ai-in-the-catalog.md). The [`AiResource`](./ai-in-the-catalog.md#airesource-entity-kind) entity kind models skills and governance rules as first-class entities with ownership, lifecycle, and dependency tracking. MCP servers can be represented using the [`API` kind with `type: mcp-server`](./ai-in-the-catalog.md#mcp-server-api-type), which captures transport endpoints through a `remotes` list.

## MCP Actions

The [MCP Actions Backend](./mcp-actions.md) plugin exposes actions registered with the [Actions Registry](../backend-system/core-services/actions-registry.md) as tools that MCP clients can call. AI coding assistants like Claude, Cursor, and VS Code Copilot can then query your Software Catalog, execute Software Templates, and search across your portal.

The MCP server uses the Streamable HTTP transport and supports OAuth authentication through [Client ID Metadata Documents (CIMD)](./mcp-actions.md#client-id-metadata-documents). See the [well-known actions](./well-known-actions.md) page for a reference of the actions that ship with Backstage.

## Published skills

[Published skills](./skills.md) are self-contained guidance files that teach AI coding assistants how to perform common Backstage engineering tasks. Skills are published to a [well-known endpoint](https://backstage.io/.well-known/skills/) on `backstage.io` and can be installed into any repository with the [`skills.sh`](https://skills.sh/) tool.

Skills cover tasks such as migrating plugins to the new frontend system, instrumenting analytics events, and migrating from Material UI (MUI) to Backstage UI (BUI). See the [well-known skills](./well-known-skills.md) page for the full list.
