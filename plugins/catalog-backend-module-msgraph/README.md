# Catalog Backend Module for Microsoft Graph

This is an extension module to the `plugin-catalog-backend` plugin, providing a
`MicrosoftGraphOrgReaderProcessor` and a `MicrosoftGraphOrgEntityProvider` that
can be used to ingest organization data from the Microsoft Graph API. This
processor is useful if you want to import users and groups from Azure Active
Directory or Office 365.

## Getting Started

First you need to decide whether you want to use an [entity provider or a processor](https://backstage.io/docs/features/software-catalog/life-of-an-entity#stitching) to ingest the organization data.
If you want groups and users deleted from the source to be automatically deleted
from Backstage, choose the entity provider.

1. Create or use an existing App registration in the [Microsoft Azure Portal](https://portal.azure.com/).
   The App registration requires at least the API permissions `Group.Read.All`,
   `GroupMember.Read.All`, `User.Read` and `User.Read.All` for Microsoft Graph
   (if you still run into errors about insufficient privileges, add
   `Team.ReadBasic.All` and `TeamMember.Read.All` too).

2. Configure the processor or entity provider:

```yaml
# app-config.yaml
catalog:
  processors:
    microsoftGraphOrg:
      providers:
        - target: https://graph.microsoft.com/v1.0
          authority: https://login.microsoftonline.com
          # If you don't know you tenantId, you can use Microsoft Graph Explorer
          # to query it
          tenantId: ${MICROSOFT_GRAPH_TENANT_ID}
          # Client Id and Secret can be created under Certificates & secrets in
          # the App registration in the Microsoft Azure Portal.
          clientId: ${MICROSOFT_GRAPH_CLIENT_ID}
          clientSecret: ${MICROSOFT_GRAPH_CLIENT_SECRET_TOKEN}
          # Optional mode for querying which defaults to "basic".
          # By default, the Microsoft Graph API only provides the basic feature set
          # for querying. Certain features are limited to advanced querying capabilities.
          # (See https://docs.microsoft.com/en-us/graph/aad-advanced-queries)
          queryMode: basic # basic | advanced
          # Optional parameter to include the expanded resource or collection referenced
          # by a single relationship (navigation property) in your results.
          # Only one relationship can be expanded in a single request.
          # See https://docs.microsoft.com/en-us/graph/query-parameters#expand-parameter
          # Can be combined with userGroupMember[...] instead of userFilter.
          userExpand: manager
          # Optional filter for user, see Microsoft Graph API for the syntax
          # See https://docs.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0#properties
          # and for the syntax https://docs.microsoft.com/en-us/graph/query-parameters#filter-parameter
          # This and userGroupMemberFilter are mutually exclusive, only one can be specified
          userFilter: accountEnabled eq true and userType eq 'member'
          # Optional filter for users, use group membership to get users.
          # (Filtered groups and fetch their members.)
          # This and userFilter are mutually exclusive, only one can be specified
          # See https://docs.microsoft.com/en-us/graph/search-query-parameter
          userGroupMemberFilter: "displayName eq 'Backstage Users'"
          # Optional parameter to include the expanded resource or collection referenced
          # by a single relationship (navigation property) in your results.
          # Only one relationship can be expanded in a single request.
          # See https://docs.microsoft.com/en-us/graph/query-parameters#expand-parameter
          # Can be combined with userGroupMember[...] instead of userFilter.
          groupExpand: member
          # Optional search for users, use group membership to get users.
          # (Search for groups and fetch their members.)
          # This and userFilter are mutually exclusive, only one can be specified
          userGroupMemberSearch: '"description:One" AND ("displayName:Video" OR "displayName:Drive")'
          # Optional filter for group, see Microsoft Graph API for the syntax
          # See https://docs.microsoft.com/en-us/graph/api/resources/group?view=graph-rest-1.0#properties
          groupFilter: securityEnabled eq false and mailEnabled eq true and groupTypes/any(c:c+eq+'Unified')
          # Optional search for groups, see Microsoft Graph API for the syntax
          # See https://docs.microsoft.com/en-us/graph/search-query-parameter
          groupSearch: '"description:One" AND ("displayName:Video" OR "displayName:Drive")'
          # Optional select for groups, this will allow you work with schemaExtensions in order to add extra information to your groups that can be used on you custom groupTransformers
          # See  https://docs.microsoft.com/en-us/graph/api/resources/schemaextension?view=graph-rest-1.0
          groupSelect: ['id', 'displayName', 'description']
```

`userFilter` and `userGroupMemberFilter` are mutually exclusive, only one can be provided. If both are provided, an error will be thrown.

By default, all users are loaded. If you want to filter users based on their attributes, use `userFilter`. `userGroupMemberFilter` can be used if you want to load users based on their group membership.

3. The package is not installed by default, therefore you have to add a
   dependency to `@backstage/plugin-catalog-backend-module-msgraph` to your
   backend package.

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-msgraph
```

### Using the Entity Provider

4. The `MicrosoftGraphOrgEntityProvider` is not registered by default, so you
   have to register it in the catalog plugin. Pass the target to reference a
   provider from the configuration.

```diff
 // packages/backend/src/plugins/catalog.ts
+import { Duration } from 'luxon';
+import { MicrosoftGraphOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-msgraph';

 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
   const builder = await CatalogBuilder.create(env);

+  // The target parameter below needs to match one of the providers' target
+  // value specified in your app-config (see above).
+  builder.addEntityProvider(
+    MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
+      id: 'production',
+      target: 'https://graph.microsoft.com/v1.0',
+      logger: env.logger,
+      schedule: env.scheduler.createScheduledTaskRunner({
+        frequency: Duration.fromObject({ minutes: 5 }),
+        timeout: Duration.fromObject({ minutes: 3 }),
+      }),
+    }),
+  );
```

### Using the Processor

4. The `MicrosoftGraphOrgReaderProcessor` is not registered by default, so you
   have to register it in the catalog plugin:

```typescript
// packages/backend/src/plugins/catalog.ts
builder.addProcessor(
  MicrosoftGraphOrgReaderProcessor.fromConfig(env.config, {
    logger: env.logger,
  }),
);
```

5. Add a location that ingests from Microsoft Graph:

```yaml
# app-config.yaml
catalog:
  locations:
    - type: microsoft-graph-org
      target: https://graph.microsoft.com/v1.0
      rules:
        - allow: [Group, User]
    …
```

## Customize the Processor or Entity Provider

In case you want to customize the ingested entities, both the `MicrosoftGraphOrgReaderProcessor`
and the `MicrosoftGraphOrgEntityProvider` allows to pass transformers for users,
groups and the organization.

1. Create a transformer:

```ts
export async function myGroupTransformer(
  group: MicrosoftGraph.Group,
  groupPhoto?: string,
): Promise<GroupEntity | undefined> {
  if (
    (
      group as unknown as {
        creationOptions: string[];
      }
    ).creationOptions.includes('ProvisionGroupHomepage')
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
  MicrosoftGraphOrgReaderProcessor.fromConfig(env.config, {
    logger: env.logger,
    groupTransformer: myGroupTransformer,
  }),
);
```
