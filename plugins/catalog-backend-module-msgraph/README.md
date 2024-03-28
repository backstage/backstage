# Catalog Backend Module for Microsoft Graph

This is an extension module to the `plugin-catalog-backend` plugin, providing a `MicrosoftGraphOrgEntityProvider`
that can be used to ingest organization data from the Microsoft Graph API.
This provider is useful if you want to import users and groups from Entra Id (formerly Azure Active Directory) or Office 365.

## Getting Started

1. Choose your authentication method - all methods supported by [DefaultAzureCredential](https://docs.microsoft.com/en-us/javascript/api/overview/azure/identity-readme?view=azure-node-latest#defaultazurecredential)

   - For local dev, use Azure CLI, Azure PowerShell or Visual Studio Code for authentication
   - If your infrastructure supports Managed Identity, use that
   - Otherwise use an App Registration

1. If using Managed Identity or App Registration for authentication, grant the following application permissions (not delegated)

   - `GroupMember.Read.All`
   - `User.Read.All`

1. Configure the entity provider:

```yaml
# app-config.yaml
catalog:
  providers:
    microsoftGraphOrg:
      providerId:
        target: https://graph.microsoft.com/v1.0
        authority: https://login.microsoftonline.com
        # If you don't know you tenantId, you can use Microsoft Graph Explorer
        # to query it
        tenantId: ${AZURE_TENANT_ID}
        # Optional ClientId and ClientSecret if you don't want to use `DefaultAzureCredential`
        # for authentication
        # Client Id and Secret can be created under Certificates & secrets in
        # the App registration in the Microsoft Azure Portal.
        clientId: ${AZURE_CLIENT_ID}
        clientSecret: ${AZURE_CLIENT_SECRET}
        # Optional mode for querying which defaults to "basic".
        # By default, the Microsoft Graph API only provides the basic feature set
        # for querying. Certain features are limited to advanced querying capabilities.
        # (See https://docs.microsoft.com/en-us/graph/aad-advanced-queries)
        queryMode: basic # basic | advanced
        # Optional configuration block
        user:
          # Optional parameter to include the expanded resource or collection referenced
          # by a single relationship (navigation property) in your results.
          # Only one relationship can be expanded in a single request.
          # See https://docs.microsoft.com/en-us/graph/query-parameters#expand-parameter
          # Can be combined with userGroupMember[...] instead of userFilter.
          expand: manager
          # Optional filter for user, see Microsoft Graph API for the syntax
          # See https://docs.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0#properties
          # and for the syntax https://docs.microsoft.com/en-us/graph/query-parameters#filter-parameter
          # This and userGroupMemberFilter are mutually exclusive, only one can be specified
          filter: accountEnabled eq true and userType eq 'member'
          # See  https://docs.microsoft.com/en-us/graph/api/resources/schemaextension?view=graph-rest-1.0
          select: ['id', 'displayName', 'description']
        # Optional configuration block
        userGroupMember:
          # Optional filter for users, use group membership to get users.
          # (Filtered groups and fetch their members.)
          # This and userFilter are mutually exclusive, only one can be specified
          # See https://docs.microsoft.com/en-us/graph/search-query-parameter
          filter: "displayName eq 'Backstage Users'"
          # Optional search for users, use group membership to get users.
          # (Search for groups and fetch their members.)
          # This and userFilter are mutually exclusive, only one can be specified
          search: '"description:One" AND ("displayName:Video" OR "displayName:Drive")'
        # Optional configuration block
        group:
          # Optional parameter to include the expanded resource or collection referenced
          # by a single relationship (navigation property) in your results.
          # Only one relationship can be expanded in a single request.
          # See https://docs.microsoft.com/en-us/graph/query-parameters#expand-parameter
          # Can be combined with userGroupMember[...] instead of userFilter.
          expand: member
          # Optional filter for group, see Microsoft Graph API for the syntax
          # See https://docs.microsoft.com/en-us/graph/api/resources/group?view=graph-rest-1.0#properties
          filter: securityEnabled eq false and mailEnabled eq true and groupTypes/any(c:c+eq+'Unified')
          # Optional search for groups, see Microsoft Graph API for the syntax
          # See https://docs.microsoft.com/en-us/graph/search-query-parameter
          search: '"description:One" AND ("displayName:Video" OR "displayName:Drive")'
          # Optional select for groups, this will allow you work with schemaExtensions
          # in order to add extra information to your groups that can be used on your custom groupTransformers
          # See  https://docs.microsoft.com/en-us/graph/api/resources/schemaextension?view=graph-rest-1.0
          select: ['id', 'displayName', 'description']
        schedule: # optional; same options as in TaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { hours: 1 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 50 }
          # supports ISO duration, "human duration" as used in code
          initialDelay: { seconds: 15},
```

`user.filter` and `userGroupMember.filter` are mutually exclusive, only one can be provided. If both are provided, an error will be thrown.

By default, all users are loaded. If you want to filter users based on their attributes, use `user.filter`. `userGroupMember.filter` can be used if you want to load users based on their group membership.

3. The package is not installed by default, therefore you have to add a
   dependency to `@backstage/plugin-catalog-backend-module-msgraph` to your
   backend package.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-msgraph
```

4. The `MicrosoftGraphOrgEntityProvider` is not registered by default, so you
   have to register it in the catalog plugin. Pass the target to reference a
   provider from the configuration.

```diff
 // packages/backend/src/plugins/catalog.ts
+import { MicrosoftGraphOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-msgraph';

 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
   const builder = await CatalogBuilder.create(env);

+  builder.addEntityProvider(
+    MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
+      logger: env.logger,
+      scheduler,
+    }),
+  );
```

Instead of configuring the refresh schedule inside the config (per provider instance),
you can define it in code (for all of them):

```diff
-      scheduler,
+      schedule: env.scheduler.createScheduledTaskRunner({
+        frequency: { hours: 1 },
+        timeout: { minutes: 50 },
+        initialDelay: { seconds: 15},
+      }),
```

## Customize the Processor or Entity Provider

In case you want to customize the ingested entities, the `MicrosoftGraphOrgEntityProvider`
allows to pass transformers for users, groups and the organization.

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

2. Add the transformer:

```diff
 builder.addEntityProvider(
   MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
     logger: env.logger,
     scheduler,
+    groupTransformer: myGroupTransformer,
   }),
 );
```
