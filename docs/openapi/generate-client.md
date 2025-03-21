---
id: generate-client
title: Generate a client from your OpenAPI spec
description: Documentation on how to create a client for a given OpenAPI spec
---

## How to generate a client with `repo-tools package schema openapi generate client`?

### Prerequisites

1. Set your OpenAPI file's `info.title` to your pluginID like so,

```yaml
info:
  # your pluginId
  title: catalog
```

2. Find or create a new plugin to house your new generated client. Currently, we do not support generating an entirely new plugin and instead just generate client files.

### Generating your client

1. Run `yarn backstage-repo-tools package schema openapi generate --client-package <directory>`. This will create a new folder in `<directory>/src/schema/openapi/generated` to house the generated content.
2. You should not need to import anything from subfolders of the `src/schema/openapi/generated` parent folder, everything you should require will be accessible from the `src/schema/openapi/generated/index.ts` file. Of note,
3. `DefaultApiClient` - this is the client that you can use to access your specific spec.
4. Any request or response types - these will be available from the index and should match the names in your spec.
