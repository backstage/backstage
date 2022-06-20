---
id: provider
title: Keycloak Authentication Provider
sidebar_label: Keycloak
description: Adding Keycloak as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with an Keycloak authentication
provider that can authenticate users using OAuth.

## Create a Keycloak realm

1. Log in to the Keycloak administrator console
2. Create a realm (or you can use an existing one)
3. Go to realm details and click `OpenID Endpoint Configuration` and copy the URL, that will be your METADATA_URL to be discovered by OIDC.

## Create a Keycloak Client

1. Log in to the Keycloak administrator console
2. Choose your realm
3. Create a `openid-connect` client
   - Client ID: backstage (or your custom client ID)
   - Standart Flow Enabled: true
   - Access Type: confidential
   - Valid Redirect URL: "YOUR_BACKSTAGE_URL/keycloak/handler/frame"
4. Click `Save Changes`

Now, you can switch to `credentials` tab to copy CLIENT ID/SECRET.

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    oidc:
      keycloak:
        development:
          clientId: ${AUTH_KEYCLOAK_CLIENT_ID}
          clientSecret: ${AUTH_KEYCLOAK_CLIENT_SECRET}
          metadataUrl: ${AUTH_KEYCLOAK_METADATA_URL}
```

The Keycloak provider is a structure with three configuration keys:

- `AUTH_KEYCLOAK_CLIENT_ID`: The Application client ID, found under the client/credentials tab.
- `AUTH_KEYCLOAK_CLIENT_SECRET`: The Application client secret, found under the client/credentials tab.
- `AUTH_KEYCLOAK_METADATA_URL`: METADATA DISCOVERY URL, found under the realm details - `OpenID Endpoint Configuration`

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `keycloakAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#adding-the-provider-to-the-sign-in-page).
