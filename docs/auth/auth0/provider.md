---
id: provider
title: Auth0 Authentication Provider
sidebar_label: Auth0
description: Adding Auth0 as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with an Auth0 authentication
provider that can authenticate users using OAuth.

## Create an Auth0 Application

1. Log in to the [Auth0 dashboard](https://manage.auth0.com/dashboard/)
2. Navigate to **Applications**
3. Create an Application
   - Name: Backstage (or your custom app name)
   - Application type: Single Page Web Application
4. Click on the Settings tab
5. Add under `Application URIs` > `Allowed Callback URLs`:
   `http://localhost:7000/api/auth/auth0/handler/frame`
6. Click `Save Changes`

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    auth0:
      development:
        clientId: ${AUTH_AUTH0_CLIENT_ID}
        clientSecret: ${AUTH_AUTH0_CLIENT_SECRET}
        domain: ${AUTH_AUTH0_DOMAIN_ID}
```

The Auth0 provider is a structure with three configuration keys:

- `clientId`: The Application client ID, found on the Auth0 Application page
- `clientSecret`: The Application client secret, found on the Auth0 Application
  page
- `domain`: The Application domain, found on the Auth0 Application page

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `auth0AuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#adding-the-provider-to-the-sign-in-page).
