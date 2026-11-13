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
3. `DefaultApiFrontendClient`, `DefaultApiBackendClient` and `DefaultApiIsomorphicClient` - these are the clients that you can use to access your specific spec. See [Choosing a client](#choosing-a-client).
4. Any request or response types - these will be available from the index and should match the names in your spec. All three clients share them.

### Choosing a client

All three clients expose the same methods. They differ in how they find the plugin and how they authenticate.

- `DefaultApiFrontendClient` is for frontend plugins. It takes only a `fetchApi` and sends requests to `plugin://<pluginId>/...` URLs. Only the `FetchApi` of a Backstage app resolves these URLs and adds credentials, so pass it `fetchApiRef` from the app. A plain `fetch` can not be used. Pass `{ token }` in the request options only if you need to override the credentials.
- `DefaultApiBackendClient` is for backend plugins and modules. It takes the `discovery` and `auth` services, resolves the base URL through discovery, and requests a plugin request token from the auth service for each call. Pass `{ token }` in the request options to use your own token, or `{ credentials }` to make the call on behalf of someone other than your own service.
- `DefaultApiIsomorphicClient` is for code that runs in both environments, such as a public client package. It takes a `discoveryApi` and an optional `fetchApi`, and only authenticates when you pass `{ token }` in the request options.

```ts
// Frontend
const client = new DefaultApiFrontendClient({ fetchApi });

// Backend
const client = new DefaultApiBackendClient({ discovery, auth });

// Isomorphic
const client = new DefaultApiIsomorphicClient({ discoveryApi, fetchApi });
```
