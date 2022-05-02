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
