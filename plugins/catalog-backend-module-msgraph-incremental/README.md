# @backstage/plugin-catalog-backend-module-msgraph-incremental

This module incrementally ingests **users** and **groups** from Microsoft Graph
into the Backstage catalog, one page at a time. It is suitable for large Azure
AD tenants where holding the full dataset in memory at once is not practical.

## Features

- **Cursor-based resumption** — the `@odata.nextLink` URL is persisted as the
  cursor, so a pod restart during ingestion resumes from the last completed page
  rather than starting over.
- **Memory-efficient** — each burst processes a single page (up to 999 users
  or 100 groups), keeping memory usage flat regardless of tenant size.
- **Photo support** — user profile photos are fetched with a gated pre-check to
  avoid unnecessary API calls for users without photos.
- **Transformer extension point** — user, group, organization, and provider
  config transformers can be customised via the
  `microsoftGraphIncrementalEntityProviderTransformExtensionPoint`.

## Prerequisites

This module requires the incremental ingestion framework to be installed:

```ts
backend.add(
  import('@backstage/plugin-catalog-backend-module-incremental-ingestion'),
);
```

## Installation

```ts
// packages/backend/src/index.ts
backend.add(
  import('@backstage/plugin-catalog-backend-module-incremental-ingestion'),
);
backend.add(
  import('@backstage/plugin-catalog-backend-module-msgraph-incremental'),
);
```

## Configuration

Uses the same `catalog.providers.microsoftGraphOrg` configuration as
`@backstage/plugin-catalog-backend-module-msgraph`. See that package's
documentation for full config reference.

```yaml
catalog:
  providers:
    microsoftGraphOrg:
      default:
        tenantId: ${AZURE_TENANT_ID}
        clientId: ${AZURE_CLIENT_ID}
        clientSecret: ${AZURE_CLIENT_SECRET}
        queryMode: advanced
        user:
          # accountEnabled eq true is applied by default; add extra filters here
          filter: "userType eq 'member'"
        group:
          filter: 'securityEnabled eq true'
        schedule:
          frequency: { hours: 12 }
          timeout: { hours: 4 }
```

## Differences from `MicrosoftGraphOrgEntityProvider`

|                            | `MicrosoftGraphOrgEntityProvider` | This module         |
| -------------------------- | --------------------------------- | ------------------- |
| Memory usage               | Full dataset in RAM               | One page at a time  |
| Resume on restart          | Starts from scratch               | Resumes from cursor |
| `userGroupMember*` options | Supported                         | Not supported       |
| `groupIncludeSubGroups`    | Supported                         | Not supported       |
| Suitable for large tenants | No                                | Yes                 |
