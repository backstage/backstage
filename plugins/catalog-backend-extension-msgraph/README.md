# Catalog Backend Extension for Microsoft Graph

This is an extension to the `plugin-catalog-backend` plugin, providing a
`MicrosoftGraphOrgReaderProcessor` that can be used to ingest organization data
from the Microsoft Graph API. This processor is useful, if you want to import
users and groups from Office 365.

## Getting Started

1. The processor is not installed by default, therefore you have to add a
   dependency to `@backstage/plugin-catalog-backend-extension-msgraph` to your
   backend package.

```bash
# From your Backstage root directory
cd packages/backend
yarn add @backstage/plugin-catalog-backend-extension-msgraph
```

2. The `MicrosoftGraphOrgReaderProcessor` is not registered by default, so you have to register it in the catalog plugin:

```typescript
// packages/backend/src/plugins/catalog.ts
builder.addProcessor(
  MicrosoftGraphOrgReaderProcessor.fromConfig(config, {
    logger,
  }),
);
```

3. Configure the processor:

```yaml
# app-config.yaml
catalog:
  processors:
    microsoftGraphOrg:
      providers:
        - target: https://graph.microsoft.com/v1.0
          authority: https://login.microsoftonline.com
          tenantId: ${MICROSOFT_GRAPH_TENANT_ID}
          clientId: ${MICROSOFT_GRAPH_CLIENT_ID}
          clientSecret: ${MICROSOFT_GRAPH_CLIENT_SECRET_TOKEN}
          # Optional filter for user, see Microsoft Graph API for the syntax
          userFilter: accountEnabled eq true and userType eq 'member'
          # Optional filter for group, see Microsoft Graph API for the syntax
          groupFilter: securityEnabled eq false and mailEnabled eq true and groupTypes/any(c:c+eq+'Unified')
```

## Customize the Processor

In case you want to customize the ingested entities, the `MicrosoftGraphOrgReaderProcessor` allows to pass transformers for users, groups and the organization.

1. Create a transformer:

```ts
export async function myGroupTransformer(
  group: MicrosoftGraph.Group,
  groupPhoto?: string,
): Promise<GroupEntity | undefined> {
  if (
    ((group as unknown) as {
      creationOptions: string[];
    }).creationOptions.includes('ProvisionGroupHomepage')
  ) {
    return undefined;
  }

  // Transformations may change namespace, change entity naming pattern, fill
  // profile with more or other details...

  // Create the group entity on your own, or wrap the default transformer
  return await defaultGroupTransformer(group, groupPhoto);
}
```

2. Configure the processor with the transformer:

```ts
builder.addProcessor(
  MicrosoftGraphOrgReaderProcessor.fromConfig(config, {
    logger,
    groupTransformer: myGroupTransformer,
  }),
);
```
