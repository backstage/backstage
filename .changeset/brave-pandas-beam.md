---
'@backstage/core-app-api': minor
---

Support custom `AuthConnector` for `OAuth2`.

A user can pass their own `AuthConnector` implementation in `OAuth2` constructor.
In which case the session manager will use that instead of the `DefaultAuthConnector` to interact with the
authentication provider.

A custom `AuthConnector` may call the authentication provider from the front-end, store and retrieve tokens
in the session storage, for example, and otherwise send custom requests to the authentication provider and
handle its responses.

Note, that if the custom `AuthConnector` transforms scopes returned from the authentication provider,
the transformation must be the same as `OAuth2CreateOptions#scopeTransform` passed to `OAuth2` constructor.
See creating `DefaultAuthConnector` in `OAuth2#create(...)` for an example.
