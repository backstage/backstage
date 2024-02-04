---
id: org
title: Microsoft Entra Tenant Data
sidebar_label: Org Data
# prettier-ignore
description: Importing users and groups from Microsoft Entra ID into Backstage
---

The Backstage catalog can be set up to ingest organizational data - users and
teams - directly from a tenant in Microsoft Entra ID via the
Microsoft Graph API.

## Installation

The package is not installed by default, therefore you have to add `@backstage/plugin-catalog-backend-module-msgraph` to your backend package.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-msgraph
```

Next add the basic configuration to `app-config.yaml`

```yaml title="app-config.yaml"
catalog:
  providers:
    microsoftGraphOrg:
      default:
        tenantId: ${AZURE_TENANT_ID}
        user:
          filter: accountEnabled eq true and userType eq 'member'
        group:
          filter: >
            securityEnabled eq false
            and mailEnabled eq true
            and groupTypes/any(c:c+eq+'Unified')
        schedule:
          frequency: PT1H
          timeout: PT50M
```

Finally, register the plugin in `catalog.ts`.
For large organizations, this plugin can take a long time, so be careful setting low frequency / timeouts and importing a large amount of users / groups for the first try.

```ts title="packages/backend/src/plugins/catalog.ts"
/* highlight-add-next-line */
import { MicrosoftGraphOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-msgraph';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);

  /* highlight-add-start */
  builder.addEntityProvider(
    MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      scheduler: env.scheduler,
    }),
  );
  /* highlight-add-end */

  // ..
}
```

## Authenticating with Microsoft Graph

### Local Development

For a local dev environment, it's recommended you have the Azure CLI or Azure PowerShell installed, and are logged in to those.
Alternatively you can use VSCode with the Azure extension if you install `@azure/identity-vscode`.
When these are set up, the plugin will authenticate with the Microsoft Graph API without you needing to configure any credentials, or granting any special permissions.
If you can't do this, you'll have to create an App Registration.

### App Registration

If none of the other authentication methods work, you can create an app registration in the azure portal.
By default the graph plugin requires the following Application permissions (not Delegated) for Microsoft Graph:

- `GroupMember.Read.All`
- `User.Read.All`

If your organization required Admin Consent for these permissions, that will need to be granted.

When authenticating with a ClientId/ClientSecret, you can either set the `AZURE_TENANT_ID`, `AZURE_CLIENT_ID` and `AZURE_CLIENT_SECRET` environment variables, or specify the values in configuration

```yaml
microsoftGraphOrg:
  default:
    ##...
    clientId: 9ef1aac6-b454-4e69-9cf5-7199df049281
    clientSecret: REDACTED
```

To authenticate with a certificate rather than a client secret, you can set the `AZURE_TENANT_ID`, `AZURE_CLIENT_ID` and `AZURE_CLIENT_CERTIFICATE_PATH` environments

### Managed Identity

If deploying to resources that supports Managed Identity, and has identities configured (e.g. Azure App Services, Azure Container Apps), Managed Identity should be picked up without any additional configuration.
If your app has multiple managed identities, you may need to set the `AZURE_CLIENT_ID` environment variable to tell Azure Identity which identity to use.

To grant the managed identity the same permissions as mentioned in _App Registration_ above, [please follow this guide](https://docs.microsoft.com/en-us/azure/app-service/tutorial-connect-app-access-microsoft-graph-as-app-javascript?tabs=azure-powershell)

## Filtering imported Users and Groups

By default, the plugin will import all users and groups from your directory.
This can be customized through [filters](https://learn.microsoft.com/en-us/graph/filter-query-parameter) and [search](https://learn.microsoft.com/en-us/graph/search-query-parameter) queries. Keep in mind that if you omit filters and search queries for the user or group properties, the plugin will automatically import all available users or groups.

### Groups

A smaller set of groups can be obtained by configuring a search query or a filter.
If both `filter` and `search` are provided, then groups must match both to be ingested.

```yaml
microsoftGraphOrg:
  providerId:
    group:
      filter: securityEnabled eq false and mailEnabled eq true and groupTypes/any(c:c+eq+'Unified')
      search: '"description:One" AND ("displayName:Video" OR "displayName:Drive")'
```

In addition to these groups, one additional group will be created for your organization.
All imported groups will be a child of this group.

### Users

There are two modes for importing users - You can import all user objects matching a `filter`.

```yaml
microsoftGraphOrg:
  providerId:
    user:
      filter: accountEnabled eq true and userType eq 'member'
```

Alternatively you can import users that are members of specific groups.
For each group matching the `search` and `filter` query, each group member will be imported.
Only direct group members will be imported, not transient users.

```yaml
microsoftGraphOrg:
  providerId:
    userGroupMember:
      filter: "displayName eq 'Backstage Users'"
      search: '"description:One" AND ("displayName:Video" OR "displayName:Drive")'
```

## Customizing Transformation

Ingested entities can be customized by providing custom transformers.
These can be used to completely replace the built in logic, or used to tweak it by using the default transformers (`defaultGroupTransformer`, `defaultUserTransformer` and `defaultOrganizationTransformer`
Entities can also be excluded from backstage by returning `undefined`.

These Transformers are be registered when configuring `MicrosoftGraphOrgEntityProvider`

```ts
builder.addEntityProvider(
  MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
    // ...
    /* highlight-add-start */
    groupTransformer: myGroupTransformer,
    userTransformer: myUserTransformer,
    organizationTransformer: myOrganizationTransformer,
    /* highlight-add-end */
  }),
);
```

When using custom transformers, you may want to customize the data returned.
Several configuration options can be provided to tweak the Microsoft Graph query to get the data you need

```yaml
microsoftGraphOrg:
  providerId:
    user:
      expand: manager
    group:
      expand: member
      select: ['id', 'displayName', 'description']
```

The following provides an example of each kind of transformer

```ts
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import {
  defaultGroupTransformer,
  defaultUserTransformer,
  defaultOrganizationTransformer,
} from '@backstage/plugin-catalog-backend-module-msgraph';
import { GroupEntity, UserEntity } from '@backstage/catalog-model';

// This group transformer completely replaces the built in logic with custom logic.
export async function myGroupTransformer(
  group: MicrosoftGraph.Group,
  groupPhoto?: string,
): Promise<GroupEntity | undefined> {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: group.id!,
      annotations: {},
    },
    spec: {
      type: 'Microsoft Entra ID',
      children: [],
    },
  };
}

// This user transformer makes use of the built in logic, but also sets the description field
export async function myUserTransformer(
  graphUser: MicrosoftGraph.User,
  userPhoto?: string,
): Promise<UserEntity | undefined> {
  const backstageUser = await defaultUserTransformer(graphUser, userPhoto);

  if (backstageUser) {
    backstageUser.metadata.description = 'Loaded from Microsoft Entra ID';
  }

  return backstageUser;
}

// Example organization transformer that removes the organization group completely
export async function myOrganizationTransformer(
  graphOrganization: MicrosoftGraph.Organization,
): Promise<GroupEntity | undefined> {
  return undefined;
}
```

## Troubleshooting

### No data

First check your logs for the message `Reading msgraph users and groups`.
If you don't see this, check you've registered the provider, and that the schedule is valid

If you see a log entry `Read 0 msgraph users and 0 msgraph groups`, check your search and filter arguments.

If you see the start message (`Reading msgraph users and groups`) but no end message (`Read X msgraph users and Y msgraph groups`), then it is likely the job is taking a long time due to a large volume of data.
The default behavior is to import all users and groups, which is often more data than needed.
Try importing a smaller set of data (e.g. `filter: displayName eq 'John Smith'`).

### Authentication / Token Errors

See [Troubleshooting Azure Identity Authentication Issues](https://aka.ms/azsdk/js/identity/troubleshoot)

### Error while reading users from Microsoft Graph: Authorization_RequestDenied - Insufficient privileges to complete the operation

- Make sure you've granted all the required permissions to your application registration or managed identity
- Make sure the permissions are `Application` permissions rather than `Delegated`
- If your organization has configured "Admin consent" to be required, make sure this has been granted for your application permissions
- If your group queries are returning Microsoft Teams groups, you may need to grant addition permissions (e.g. `Team.ReadBasic.All`, `TeamMember.Read.All`)
- If you've added additional `select` or `expand` fields, those may need additional permissions granted
