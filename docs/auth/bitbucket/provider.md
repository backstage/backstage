---
id: provider
title: Bitbucket Authentication Provider
sidebar_label: Bitbucket
description: Adding Bitbucket OAuth as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a Bitbucket authentication
provider that can authenticate users using Bitbucket Cloud. This does **NOT**
work with Bitbucket Server.

## Create an OAuth Consumer in Bitbucket

To add Bitbucket Cloud authentication, you must create an OAuth Consumer.

Go to `https://bitbucket.org/<your-project-name>/workspace/settings/api` .

Click Add Consumer.

Settings for local development:

- Application name: Backstage (or your custom app name)
- Callback URL: `http://localhost:7007/api/auth/bitbucket`
- Other are optional
- (IMPORTANT) **Permissions: Account - Read, Workspace membership - Read**

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    bitbucket:
      development:
        clientId: ${AUTH_BITBUCKET_CLIENT_ID}
        clientSecret: ${AUTH_BITBUCKET_CLIENT_SECRET}
        ## uncomment to set lifespan of user session
        # sessionDuration: { hours: 24 } # supports `ms` library format (e.g. '24h', '2 days'), ISO duration, "human duration" as used in code
        signIn:
          resolvers:
            # See https://backstage.io/docs/auth/bitbucket/provider#resolvers for more resolvers
            - resolver: userIdMatchingUserEntityAnnotation
```

The Bitbucket provider is a structure with two configuration keys:

- `clientId`: The Key that you generated in Bitbucket, e.g.
  `b59241722e3c3b4816e2`
- `clientSecret`: The Secret tied to the generated Key.

### Optional

- `sessionDuration`: Lifespan of the user session.

### Resolvers

This provider includes several resolvers out of the box that you can use:

- `emailMatchingUserEntityProfileEmail`: Matches the email address from the auth provider with the User entity that has a matching `spec.profile.email`. If no match is found, it will throw a `NotFoundError`.
- `emailLocalPartMatchingUserEntityName`: Matches the [local part](https://en.wikipedia.org/wiki/Email_address#Local-part) of the email address from the auth provider with the User entity that has a matching `name`. If no match is found, it will throw a `NotFoundError`.
- `userIdMatchingUserEntityAnnotation`: Matches the `userId` from the auth provider with the User entity that has a matching `bitbucket.org/user-id` annotation. If no match is found, it will throw a `NotFoundError`.
- `usernameMatchingUserEntityAnnotation`: Matches the `username` from the auth provider with the User entity that has a matching `bitbucket.org/username` annotation. If no match is found, it will throw a `NotFoundError`.

:::note Note

The resolvers will be tried in order but will only be skipped if they throw a `NotFoundError`.

:::

If these resolvers do not fit your needs, you can build a custom resolver; this is covered in the [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers) section of the Sign-in Identities and Resolvers documentation.

## Backend Installation

To add the provider to the backend, we will first need to install the package by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-bitbucket-provider
```

Then we will need to add this line:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend-module-bitbucket-provider'));
/* highlight-add-end */
```

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `bitbucketAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#sign-in-configuration).
