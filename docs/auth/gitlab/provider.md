---
id: provider
title: GitLab Authentication Provider
sidebar_label: GitLab
description: Adding GitLab OAuth as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a GitLab authentication
provider that can authenticate users using GitLab OAuth.

## Create an OAuth App on GitLab

To support GitLab authentication, you must create an Application from the
[GitLab settings](https://gitlab.com/-/profile/applications). The `Redirect URI`
should point to your Backstage backend auth handler.

1. Set Application Name to `backstage-dev` or something along those lines.
2. The Authorization Callback URL should match the redirect URI set in Backstage.
   1. Set this to `http://localhost:7007/api/auth/gitlab/handler/frame` for local development.
   2. Set this to `http://{APP_FQDN}:{APP_BACKEND_PORT}/api/auth/gitlab/handler/frame` for non-local deployments.
   3. Select the following scopes from the list:
      - [x] `api` Grants full read-write access to the api. This is only required if users need to be able to create merge requests with their own permissions.
      - [x] `read_api` Grants read access to the API, including all groups and projects, the container registry, and the package registry.
      - [x] `read_user` Grants read-only access to the authenticated user's profile through the /user API endpoint, which includes username, public email, and full name. Also grants access to read-only API endpoints under /users.
      - [x] `read_repository` Grants read-only access to repositories on private projects using Git-over-HTTP (not using the API).
      - [x] `write_repository` Grants read-write access to repositories on private projects using Git-over-HTTP (not using the API).
      - [x] `openid` Grants permission to authenticate with GitLab using OpenID Connect. Also gives read-only access to the user's profile and group memberships.
      - [x] `profile` Grants read-only access to the user's profile data using OpenID Connect.
      - [x] `email` Grants read-only access to the user's primary email address using OpenID Connect.

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    gitlab:
      development:
        clientId: ${AUTH_GITLAB_CLIENT_ID}
        clientSecret: ${AUTH_GITLAB_CLIENT_SECRET}
        ## uncomment if using self-hosted GitLab
        # audience: https://gitlab.company.com
        ## uncomment if using a custom redirect URI
        # callbackUrl: https://${BASE_URL}/api/auth/gitlab/handler/frame
        ## uncomment to set lifespan of user session
        # sessionDuration: { hours: 24 } # supports `ms` library format (e.g. '24h', '2 days'), ISO duration, "human duration" as used in code
        signIn:
          resolvers:
            # See https://backstage.io/docs/auth/gitlab/provider#resolvers for more resolvers
            - resolver: usernameMatchingUserEntityName
```

The GitLab provider is a structure with three configuration keys:

- `clientId`: The Application ID that you generated on GitLab, e.g.
  `4928c033ab3d592845c044a653bc20583baf84f2e67b954c6fdb32a532ab76c9`
- `clientSecret`: The Application secret
- `audience` (optional): The base URL for the self-hosted GitLab instance, e.g.
  `https://gitlab.company.com`
- `callbackUrl` (optional): The URL matching the Redirect URI registered when creating your GitLab OAuth App, e.g.
  `https://$backstage.acme.corp/api/auth/gitlab/handler/frame`
  Note: Due to a peculiarity with GitLab OAuth, ensure there is no trailing `/` after 'frame' in the URL.
- `sessionDuration` (optional): Lifespan of the user session.

### Resolvers

This provider includes several resolvers out of the box that you can use:

- `emailMatchingUserEntityProfileEmail`: Matches the email address from the auth provider with the User entity that has a matching `spec.profile.email`. If no match is found, it will throw a `NotFoundError`.
- `emailLocalPartMatchingUserEntityName`: Matches the [local part](https://en.wikipedia.org/wiki/Email_address#Local-part) of the email address from the auth provider with the User entity that has a matching `name`. If no match is found, it will throw a `NotFoundError`.
- `usernameMatchingUserEntityName`: Matches the username from the auth provider with the User entity that has a matching `name`. If no match is found, it will throw a `NotFoundError`.

:::note Note

The resolvers will be tried in order but will only be skipped if they throw a `NotFoundError`.

:::

If these resolvers do not fit your needs, you can build a custom resolver; this is covered in the [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers) section of the Sign-in Identities and Resolvers documentation.

## Backend Installation

To add the provider to the backend, we will first need to install the package by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-gitlab-provider
```

Then we will need to add this line:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend-module-gitlab-provider'));
/* highlight-add-end */
```

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `gitlabAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#sign-in-configuration).
