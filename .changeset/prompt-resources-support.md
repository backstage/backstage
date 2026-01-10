---
'@backstage/backend-plugin-api': minor
'@backstage/backend-defaults': minor
'@backstage/plugin-mcp-actions-backend': minor
'@backstage/backend-test-utils': patch
'@backstage/plugin-catalog-backend': patch
---

Add prompts and resources support to the Actions Registry and MCP integration.

**New Features:**

- **ActionsRegistryService**: Added `registerPrompt()` and `registerResource()` methods allowing plugins to register prompts and resources alongside actions
- **ActionsService**: Added `listPrompts()`, `listResources()`, and `readResource()` methods to discover and read prompts and resources from configured plugin sources
- **MCP Actions Backend**: Updated to expose prompts and resources via the Model Context Protocol, enabling AI clients to receive contextual guidance and browse available data. Full support for reading resource contents is included.
- **Catalog Backend**: Added example prompts ("explore-catalog", "catalog-metadata") and resources ("catalog://entities/{kind}", "catalog://summary") demonstrating the new capabilities

**Why This Change:**

The existing MCP actions integration only exposed tools (callable actions) without context. This made it difficult for AI clients to understand what actions were available or how to use them effectively. By adding prompts and resources:

- **Prompts** provide AI clients with guidance about the catalog structure, entity types, and how to search
- **Resources** enable browsing of catalog entities and summary statistics
- AI clients can now discover and understand the catalog before needing to call specific actions

This addresses the limitations noted in RFC #30218. The MCP SDK (v1.25.2) now has stable APIs for prompts and resources, making this the right time to implement these features.

**Example Usage:**

```typescript
// In your plugin
actionsRegistry.registerPrompt({
  name: 'my-prompt',
  title: 'Helpful Context',
  description: 'Explains how to use this plugin',
  template: 'This plugin provides X, Y, and Z capabilities...',
});

actionsRegistry.registerResource({
  name: 'my-resource',
  uri: 'plugin://data/{type}',
  title: 'Browse Plugin Data',
  description: 'List available data by type',
  mimeType: 'application/json',
  handler: async (uri, params, context) => {
    // Return browsable data
    return { contents: [{ uri: uri.href, text: JSON.stringify(data) }] };
  },
});
```

**Resource Reading:**

Resources can be both listed and read. When an MCP client requests a resource by URI (e.g., `catalog://entities/Component`), the MCP server:

1. Calls `ActionsService.readResource()` with the URI
2. The service tries each configured plugin source to find a matching resource handler
3. URI parameters are extracted (e.g., `{kind}` → `Component`)
4. The handler is invoked and returns the resource contents
5. Contents are returned to the AI client for browsing
