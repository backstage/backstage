---
id: provider
title: Atlassian Authentication Provider
sidebar_label: Atlassian
description: Adding Atlassian as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with an Atlassian authentication
provider that can authenticate users using Atlassian products. This auth
**only** provides scopes for the following APIs:

- Confluence API
- User REST API
- Jira platform REST API
- Jira Service Desk API
- Personal data reporting API
- User identity API

## Create an OAuth 2.0 (3LO) app in the Atlassian developer console

To add Atlassian authentication, you must create an OAuth 2.0 (3LO) app.

Go to `https://developer.atlassian.com/console/myapps/`.

Click on the drop-down `Create` and choose `OAuth 2.0 integration`.

Name your integration and click on the `Create` button.

Settings for local development:

- Callback URL: `http://localhost:7007/api/auth/atlassian/handler/frame`
- Use rotating refresh tokens
- For permissions, you **must** enable `View user profile` for the currently
  logged-in user, under `User identity API`

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    atlassian:
      development:
        clientId: ${AUTH_ATLASSIAN_CLIENT_ID}
        clientSecret: ${AUTH_ATLASSIAN_CLIENT_SECRET}
        audience: 'https://api.atlassian.com'
        callbackUrl: 'https://backstage.example.com/api/auth/atlassian/handler/frame'
        additionalScopes:
          - 'read:jira-user'
          - 'read:jira-work'
        ## uncomment to set lifespan of user session
        # sessionDuration: { hours: 24 } # supports `ms` library format (e.g. '24h', '2 days'), ISO duration, "human duration" as used in code
        signIn:
          resolvers:
            # See https://backstage.io/docs/auth/atlassian/provider#resolvers for more resolvers
            - resolver: usernameMatchingUserEntityName
```

The Atlassian provider is a structure with the following configuration keys:

- `clientId`: The Key you generated in the developer console.
- `clientSecret`: The Secret tied to the generated Key.
- `audience`: (Optional) Specifies the intended recipient of the tokens.
- `callbackUrl`: (Optional) Must match the redirect URL set in Atlassian OAuth settings.
- `additionalScopes` : (Optional) Additional permissions requested from Atlassian.

**NOTE:** The scopes `offline_access`, `read:jira-work`, and `read:jira-user` are provided by default.

### Optional

- `sessionDuration`: Lifespan of the user session.

### Resolvers

This provider includes several resolvers out of the box that you can use:

- `emailMatchingUserEntityProfileEmail`: Matches the email address from the auth provider with the User entity that has a matching `spec.profile.email`. If no match is found, it will throw a `NotFoundError`.
- `emailLocalPartMatchingUserEntityName`: Matches the [local part](https://en.wikipedia.org/wiki/Email_address#Local-part) of the email address from the auth provider with the User entity that has a matching `name`. If no match is found, it will throw a `NotFoundError`.
- `usernameMatchingUserEntityName`: Matches the username from the auth provider with the User entity that has a matching `name`. If no match is found, it will throw a `NotFoundError`.

:::note Note

The resolvers will be tried in order but will only be skipped if they throw a `NotFoundError`.

:::

If these resolvers do not fit your needs, you can build a custom resolver, this is covered in the [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers) section of the Sign-in Identities and Resolvers documentation.

## Backend Installation

To add the provider to the backend, we will first need to install the package by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-atlassian-provider
```

Then we will need to this line:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend-module-atlassian-provider'));
/* highlight-add-end */
```

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `atlassianAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#sign-in-configuration).
