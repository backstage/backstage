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

1. Run `yarn backstage-repo-tools schema openapi generate client --output-package <directory>`. This will create a new folder in `<directory>/src/generated` to house the generated content.
2. You should use the generated files as follows,

- `apis/DefaultApi.client.ts` - this is the client that you should use. It has types for all of the various operations on your API.
- `models/*` - These are the types generated from your OpenAPI file, ideally you should not need to use these directly and can instead use the inferred types from `apis/DefaultApi.client.ts`.
- everything else is directory specific and shouldn't be touched.
