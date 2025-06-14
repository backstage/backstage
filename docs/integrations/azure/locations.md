---
id: locations
title: Azure DevOps Locations
sidebar_label: Locations
description: Integrating source code stored in Azure DevOps into the Backstage catalog
---

The Azure DevOps integration supports loading catalog entities from Azure
DevOps. Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

## Authentication

The Azure integration supports several methods to authenticate against Azure DevOps. The following sections describe how to configure the integration for each authentication method.

It is also possible to configure separate authentication methods for different Azure DevOps organizations. This is useful if you have multiple organizations and want to use (or have to) different credentials for each organization.

### Using a service principal with a client secret

A service principal is an Entra ID identity that can be used to authenticate against Azure DevOps. The service principal is created in Entra ID and has a client ID and client secret (akin to a username and password).

The following configuration shows how to use a service principal to authenticate against Azure DevOps:

```yaml
integrations:
  azure:
    - host: dev.azure.com
      credentials:
        - clientId: ${AZURE_CLIENT_ID}
          clientSecret: ${AZURE_CLIENT_SECRET}
          tenantId: ${AZURE_TENANT_ID}
```

See the Azure DevOps documentation on how to grant access to the [service principal](https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/service-principal-managed-identity).

#### Using a system-assigned managed identity

A system-assigned [managed identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) is an Entra ID identity that is tied to a specific Azure resource and managed by Azure. In contrast to a user-assigned managed identity, a system-assigned managed identity shares the lifecycle of the resource to which it is assigned and Azure guarantees that the identity can only be used by the specific resource.

The following configuration shows how to use a system-assigned managed identity to authenticate against Azure DevOps:

```yaml
integrations:
  azure:
    - host: dev.azure.com
      credentials:
        - clientId: system-assigned
```

See the Azure DevOps documentation on how to grant access to the [managed identity](https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/service-principal-managed-identity).

#### Using a user-assigned managed identity

A user-assigned [managed identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) is an Entra ID identity that is created as a standalone resource by the user and assigned to one or more Azure resources. This allows you to use the same managed identity across multiple resources.

The following configuration shows how to use a user-assigned managed identity to authenticate against Azure DevOps:

```yaml
integrations:
  azure:
    - host: dev.azure.com
      credentials:
        - clientId: ${AZURE_CLIENT_ID}
```

See the Azure DevOps documentation on how to grant access to the [managed identity](https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/service-principal-managed-identity).

### Using a personal access token (PAT)

A personal access token (PAT) is a token you generate with a specific scope and expiration date. It allows Backstage to authenticate against Azure DevOps on your behalf.

The following configuration shows how to use a personal access token to authenticate against Azure DevOps:

```yaml
integrations:
  azure:
    - host: dev.azure.com
      credentials:
        - personalAccessToken: ${PERSONAL_ACCESS_TOKEN}
```

See the Azure DevOps documentation on how to create a [personal access token](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate)

### Using a service principal with a managed identity to generate the client assertion

Using a managed identity to generate a client assertion is an advanced scenario. It requires you to setup a federated credential for the app registration in Azure Entra ID.

It is most useful when you want to [authenticate against an Azure DevOps organization in a different tenant](#authenticate-against-an-azure-devops-organization-in-a-different-tenant) than the managed identity itself. Otherwise [a regular managed identity](#using-a-system-assigned-managed-identity) is probably a more suitable choice.

#### Add a federated credential

To be able to use a managed identity to generate a client assertion, you need to create a federated credential in Azure Entra ID. Follow these steps:

1. Create an app registration in Entra ID (or use an existing one).
2. Navigate to the "Certificates & secrets" tab for your app registration.
3. Add a new federated credential using the "Customer managed keys" scenario.
4. Select the managed identity you want to use to generate the client assertion.
5. Enter the name and description.
6. Click "Add".

You can now add the required configuration to the Azure DevOps integration in Backstage. The `${APP_REGISTRATION_CLIENT_ID}` is the client ID of the app registration in Entra ID where you added the federated credential.

#### Using a system-assigned managed identity to generate the client assertion

This is the most secure option because Azure guarantees that the identity can only be used by the specific resource, whereas a user-assigned managed identity can be assigned to any resource in the same tenant.

```yaml
integrations:
  azure:
    - host: dev.azure.com
      credentials:
        - clientId: ${APP_REGISTRATION_CLIENT_ID}
          managedIdentityClientId: system-assigned
          tenantId: ${AZURE_TENANT_ID}
```

#### Using a user-assigned managed identity to generate the client assertion

```yaml
integrations:
  azure:
    - host: dev.azure.com
      credentials:
        - clientId: ${APP_REGISTRATION_CLIENT_ID}
          managedIdentityClientId: ${MANAGED_IDENTITY_CLIENT_ID}
          tenantId: ${AZURE_TENANT_ID}
```

### Authenticating against multiple Azure DevOps organizations

You can use specific credentials for different Azure DevOps organizations by specifying the `organizations` field on the credential:

```yaml
integrations:
  azure:
    - host: dev.azure.com
      credentials:
        - organizations:
            - my-org
            - my-other-org
          clientId: ${AZURE_CLIENT_ID}
          clientSecret: ${AZURE_CLIENT_SECRET}
          tenantId: ${AZURE_TENANT_ID}
        - organizations:
            - another-org
          clientId: ${AZURE_CLIENT_ID}
        - organizations:
            - yet-another-org
          personalAccessToken: ${PERSONAL_ACCESS_TOKEN}
```

If you do not specify the `organizations` field the credential will be used for all organizations for which no other credential is configured.

### Authenticate against an Azure DevOps organization in a different tenant

If you need to authenticate against an Azure DevOps organization in a different tenant than the service principal, you have to either:

- [Create a multi-tenant application in Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/single-and-multi-tenant-apps).
- [Convert the existing application to a multi-tenant application](https://learn.microsoft.com/en-gb/entra/identity-platform/howto-convert-app-to-be-multi-tenant#update-registration-to-be-multitenant).

:::note Note

Make sure that your application requests at least one Graph API permission. This is required to be able to install the application in another tenant. The least privileged permission you can request is the [`email` permission](https://learn.microsoft.com/en-us/graph/permissions-reference#email) with type `Delegated`. This allows the application to read the e-mail address of the signed-in user, but without the [`openid` permission](https://learn.microsoft.com/en-us/graph/permissions-reference#openid) users cannot actually sign in.

:::

After you have done that, an admin from the other tenant has to install your application by providing admin consent for the requested permissions. This can be done by visiting the following URL:

```plaintext
https://login.microsoftonline.com/<other-tenant-id>/oauth2/authorize?client_id=<client-id>&response_type=code&redirect_uri=<redirect-uri>
```

The `<other-tenant-id>` is the tenant ID of the other tenant, `<client-id>` is the client ID of the application (in your tenant), and `<redirect-uri>` is the redirect URI configured for the application. The redirect URI must be a valid URI in the application registration, but you can use any valid URI for this purpose, for example `https://backstage.io`.

After the admin has consented to the application, an Enterprise Application, also called a Service Principal, will be created in the other tenant with the same client ID as the app registration in the original tenant. You can now grant the service principal access to the Azure DevOps organization in the other tenant. To authenticate against the Azure DevOps organization in the other tenant, you can use the same service principal as before, but with the tenant ID of the other tenant:

```yaml
integrations:
  azure:
    - host: dev.azure.com
      credentials:
        - clientId: ${APP_REGISTRATION_CLIENT_ID}
          managedIdentityClientId: system-assigned
          tenantId: ${OTHER_TENANT_ID}
```

Where `${APP_REGISTRATION_CLIENT_ID}` is the client ID of the multi-tenant app registration in you created in your own tenant, and `${OTHER_TENANT_ID}` is the tenant ID of the other tenant where you .

:::note Note

The example above uses a [system-assigned managed identity to generate the client assertion](#using-a-system-assigned-managed-identity-to-generate-the-client-assertion). You can also use a [user-assigned managed identity to generate the client assertion](#using-a-user-assigned-managed-identity-to-generate-the-client-assertion) or a client secret to authenticate for the application.

However a system-assigned managed identity is the most secure option because:

- Azure guarantees that the identity can only be used by the specific resource, whereas a user-assigned managed identity can be used by any resource.
- There is no need to manage the underlying secrets, Azure takes care of that for you.

:::

## Configuration schema

The configuration is a structure with these elements:

- `credentials`: (optional): must be one of the following:
  - A service principal using a client secret
  - A service principal using a managed identity client assertion
  - A managed identity
  - A personal access token

The `credentials` element is an array where each entry is a structure with exactly these of elements:

- For a service principal with client secret:
  - `clientId`: The client ID of the service principal
  - `clientSecret`: The client secret of the service principal
  - `tenantId`: The tenant ID of the service principal
- For a service principal with managed identity client assertion:
  - `clientId`: The client ID of the service principal
  - `managedIdentityClientId`: the client ID of the managed identity used to generate the client assertion token. Use `system-assigned` for system-assigned managed identities or the client ID of a user-assigned managed identity.
  - `tenantId`: The tenant ID of the service principal
- For managed identity:
  - `clientId`: the client ID of the managed identity used to generate the client assertion token.
- For personal access token:
  - `personalAccessToken`: The personal access token

:::note Note

- You cannot use a service principal or managed identity for Azure DevOps Server (on-premises) organizations
- You can only use a service principal or managed identity for Microsoft Entra ID (formerly Azure Active Directory) backed Azure DevOps organizations
- You can only specify one credential per host without any organizations specified
- The personal access token should just be provided as the raw token generated by Azure DevOps using the format `raw_token` with no base64 encoding. Formatting and base64'ing is handled by dependent libraries handling the Azure DevOps API
- The managed identity used to generate the client assertion must be in the same Entra ID tenant as the app registration.

:::
