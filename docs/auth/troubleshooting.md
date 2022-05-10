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

## General troubleshooting

This section contains some general troubleshooting tips.

### Stepping through authentication manually

Authentication happens in a popup window that redirects to the identity providers authorization
endpoint. Once auth is complete the identity provider will redirect back to the auth backend,
which immediately serves a simple HTML page that posts the result back to the main window, which
then closes the popup.

Because the popup is closed automatically it can sometimes be difficult to inspect the auth
flow, especially if one wants to debug the cookies that are being set. One way around this is to
manually head to the `/start` endpoint of the provider, which is the page that the popup will
point to initially. For example, if you want to troubleshoot GitHub auth locally, you'd head
to `http://localhost:7007/api/auth/github/start?env=development`. Note that the `env` parameter
needs to be set, and it's possible that you may need to set the `scope` parameter for some providers
as well.

Once you've stepped through the auth flow you should end up at the `/handler/frame` endpoint, which displays
an empty page. This is where the result is normally posted back to the main window, but since we've
reached it using the manual flow that won't happen. You can still inspect the result though, both
by viewing the source code of the page, or printing the value of the `authResponse` variable in the console.

### Inspecting the refresh call

If you're running into problems with session persistence, such as users being signed out when reloading
the page, it will be something that's going wrong with the call to the `/refresh` endpoint of the
auth provider. Head to the network inspector and filter by `/refresh`. Find the `GET` request towards
`<backend.baseUrl>/api/auth/<provider>/refresh` and inspect the request.

Note that extra calls to the refresh endpoint may be made by the frontend in order to check whether
auth providers have an existing session. This means that there might be multiple calls, including some
that are failing. Make sure you're looking at the refresh call to the provider that you're troubleshooting,
and don't worry about other failing refresh calls.

### Inspecting the contents of a Backstage token

The Backstage token that's issues during sign-in is a plain JWT. You can inspect the contents using
any tool that supports JWTs, or you can parse the payload yourself in for example the browser console
or a Node.js REPL:

```js
atob(token.split('.')[1]);
```
