---
id: provider
title: Microsoft Azure Authentication Provider
sidebar_label: Azure
description: Adding Microsoft Azure as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a Microsoft authentication
provider that can authenticate users using Azure OAuth.

## Create an App Registration on Azure

To support Azure authentication, you must create an App Registration:

1. Log in to the [Azure Portal](https://portal.azure.com/)
2. Create an
   [Active Directory Tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview),
   if one does not yet exist
3. Navigate to
   [Azure Active Directory > App Registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps)
4. Register an application
   - Name: Backstage (or your custom app name)
   - Redirect URI: Web >
     `http://localhost:7007/api/auth/microsoft/handler/frame`
5. Navigate to **Certificates & secrets > New client secret** to create a secret

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    microsoft:
      development:
        clientId: ${AUTH_MICROSOFT_CLIENT_ID}
        clientSecret: ${AUTH_MICROSOFT_CLIENT_SECRET}
        tenantId: ${AUTH_MICROSOFT_TENANT_ID}
```

The Microsoft provider is a structure with three configuration keys:

- `clientId`: Application (client) ID, found on App Registration > Overview
- `clientSecret`: Secret, found on App Registration > Certificates & secrets
- `tenantId`: Directory (tenant) ID, found on App Registration > Overview

## Outbound Network Access

If your environment has restrictions on outgoing access (e.g. through
firewall rules), make sure your Backstage backend has access to the following
hosts:

- `login.microsoftonline.com`, to get and exchange authorization codes and access
  tokens
- `graph.microsoft.com`, to fetch user profile information (as seen
  in [this source
  code](https://github.com/seanfisher/passport-microsoft/blob/0456aa9bce05579c18e77f51330176eb26373658/lib/strategy.js#L93-L95)).
  If this host is unreachable, users may see an `Authentication failed, failed to fetch user profile` error when they attempt to log in.

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `microsoftAuthApiRef` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#adding-the-provider-to-the-sign-in-page).
