# User Authentication and Authorization in Backstage

## Summary

The purpose of the Auth APIs in Backstage are to identify the user, and to
provide a way for plugins to request access to 3rd party services on behalf of
the user (OAuth). This documentation focuses on the implementation of that
solution and how to extend it. For documentation on how to consume the Auth APIs
in a plugin, see [TODO](#TODO).

### Accessing Third Party Services

The main pattern for talking to third party services in Backstage is
user-to-server requests, where short-lived OAuth Access Tokens are requested by
plugins to authenticate calls to external services. These calls can be made
either directly to the services or through a backend plugin or service.

By relying on user-to-server calls we keep the coupling between the frontend and
backend low, and provide a much lower barrier for plugins to make use of third
party services. This is in comparison to for example a session-based system,
where access tokens are stored server-side. Such a solution would require a much
deeper coupling between the auth backend plugin, its session storage, and other
backend plugins or separate services. A goal of Backstage is to make it as easy
as possible to create new plugins, and an auth solution based on user-to-server
OAuth helps in that regard.

The method with which frontend plugins request access to third party services is
through [Utility APIs](../getting-started/utility-apis.md) for each service
provider. For a full list of providers, see [TODO](#TODO).

### Identity - TODO

This documentation currently only covers the OAuth use-case, as identity
management is not settled yet and part of an
[upcoming milestone](https://github.com/spotify/backstage/milestone/12).

## Further Reading

More details are provided in dedicated sections of the documentation.

- [OAuth](./oauth): Description of the generic OAuth flow implemented by the
  [auth-backend](../../plugins/auth-backend).
- [Glossary](./glossary): Glossary of some common terms related to the auth
  flows.
