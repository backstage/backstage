---
id: provider
title: Okta Authentication Provider
sidebar_label: Okta
description: Adding Okta OAuth as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a Okta authentication
provider that can authenticate users using Okta OpenID Connect.

## Create an Application on Okta

To add Okta authentication, you must create an Application from Okta:

1. Log into Okta (generally company.okta.com)
2. Navigate to Menu >> Applications >> Applications >> `Create App Integration`
3. Fill out the Create a new app integration form:
   - `Sign-in method`: `OIDC - OpenID Connect`
   - `Application type`: `Web Application`
   - Click Next
4. Fill out the New Web App Integration form:
   - `App integration name`: `Backstage` (or your custom app name)
   - `Grant type`: `Authorization Code` & `Refresh Token`
   - `Sign-in redirect URIs`:
     `http://localhost:7007/api/auth/okta/handler/frame`
   - `Sign-out redirect URIs`: `http://localhost:7007`
   - `Controlled access`: (select as appropriate)
   - Click Save

The configuration examples provided above are suitable for local development. For a production deployment, substitute `http://localhost:7007` with the url that your Backstage instance is available at.

# Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    okta:
      development:
        clientId: ${AUTH_OKTA_CLIENT_ID}
        clientSecret: ${AUTH_OKTA_CLIENT_SECRET}
        audience: ${AUTH_OKTA_DOMAIN}
        authServerId: ${AUTH_OKTA_AUTH_SERVER_ID} # Optional
        idp: ${AUTH_OKTA_IDP} # Optional
        # https://developer.okta.com/docs/reference/api/oidc/#scope-dependent-claims-not-always-returned
        additionalScopes: ${AUTH_OKTA_ADDITIONAL_SCOPES} # Optional
```

The values referenced are found on the Application page on your Okta site.

- `clientId`: The client ID that you generated on Okta, e.g.
  `3abe134ejxzF21HU74c1`
- `clientSecret`: The client secret shown for the Application.
- `audience`: The Okta domain shown for the Application, e.g.
  `https://company.okta.com`
- `authServerId`: The authorization server ID for the Application
- `idp`: The identity provider for the application, e.g. `0oaulob4BFVa4zQvt0g3`

`additionalScopes` is an optional value, a string of space separated scopes, that will be combined with the default `scope` value of `openid profile email offline_access` to adjust the `scope` sent to Okta during OAuth. This will have an impact on [the dependent claims returned](https://developer.okta.com/docs/reference/api/oidc/#scope-dependent-claims-not-always-returned). For example, setting the `additionalScopes` value to `groups` will result in the claim returning a list of the groups that the user is a member of that also match the ID token group filter of the client app.

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `oktaAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#adding-the-provider-to-the-sign-in-page).
