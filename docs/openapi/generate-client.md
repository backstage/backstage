## How to generate a client with `repo-tools schema openapi generate-client`?

### Prerequisites

1. Add your plugin ID as the last `servers` item, like this,

```yaml
servers:
  # first value, used for OpenAPI router validation.
  - url: /

  # final value, pluginId.
  - url: catalog
```

2. Find or create a new plugin to house your new generated client. Currently, we do not support generating an entirely new plugin and instead just generate client files.

### Generating your client

1. Run `yarn backstage-repo-tools schema openapi generate-client --input-spec <file> --output-directory <directory>`. This will create a new folder in `<directory>/src/generated` to house the generated content.
2. You should use the generated files as follows,

- `apis/DefaultApi.client.ts` - this is the client that you should use. It has types for all of the various operations on your API.
- `models/*` - These are the types generated from your OpenAPI file, ideally you should not need to use these directly and can instead use the inferred types from `apis/DefaultApi.client.ts`.
- everything else is directory specific and shouldn't be touched.
