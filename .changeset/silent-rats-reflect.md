---
'@backstage/repo-tools': minor
---

Adds a new command `schema openapi generate-client` that creates a Typescript client with Backstage flavor, including the discovery API and fetch API. This command doesn't currently generate a complete client and needs to be wrapped or exported manually by a separate Backstage plugin. See `@backstage/catalog-client/src/generated` for example output.
