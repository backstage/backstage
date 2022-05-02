---
id: troubleshooting
title: Troubleshooting Auth
description: Guidance for various issues that one might run into when setting up authentication
---

Auth is tricky and doesn't always work as expected. Below you'll find some of the common
problems one might run into when setting up authentication, as well as some general
troubleshooting tips.

## Sign-in fails with "... provider is not configured to support sign-in"

This happens if you try to sign in using an auth provider that has not been
configured to allow sign-in. See the [Sign-in Identities and Resolvers](./identity-resolver.md)
page for information about how to configure and customize sign-in.

As part of the 1.1 release of Backstage we removed the default implementations
of all sign-in resolvers. This was a necessary security fix as well as a step
towards providing more clarity in the configuration of the sign-in process.
You may encounter this error if you are upgrading from a previous version, in
which case you would need to configure a sign-in resolver as described above.

## Auth fails with "Auth provider registered for ... is misconfigured"

This will typically only happen during development, as in a production build the auth
backend will fail to start up altogether if a provider is misconfigured.

Double check that your configuration for the provider is correct. Note that environment variables
such as `AUTH_OAUTH2_CLIENT_ID` must be set and will **NOT** be picked up from `.env` files.
You can use the `yarn backstage-cli config:print --lax` command to print your local configuration.

The backend logs should also provide insight into why the configuration of the provider
fails. In working setup the backend should log something like `"Configuring provider, oauth2"`,
while it with otherwise log a warning like `"Skipping oauth2 auth provider, ..."`.

## Auth fails with "Login failed; caused by NotAllowedError: Origin '...' is not allowed"

This will happen if the origin of the configured `app.baseUrl` in the auth backend does not
match the origin that the frontend is being accessed at. Make sure that `app.baseUrl` matches
what a user sees in the browser address bar.

If you wish to support multiple different origins at once, there is an experimental configuration
that lets you do this. The `auth.experimentalExtraAllowedOrigins` key accepts a list of origin
glob patterns where sign-in should be allowed from.

## Sign-in fails with the error "User not found"

Many built-in sign-in resolvers require user entities to be present in the catalog. This
error is encountered if authentication is successful, but a matching user entity is not
present in the catalog. If you wish to enable sign-in without having users be represented
in the catalog data, see the method that's documented in the
[sign-in resolver documentation](./identity-resolver.md#sign-in-without-users-in-the-catalog).

If you want to customize this error message, you can create a custom sign-in resolver and
catch the `NotFoundError` thrown by `ctx.signInWithCatalogUser` or `ctx.findCatalogUser`.
