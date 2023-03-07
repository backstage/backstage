---
'@backstage/core-app-api': minor
---

`OAuth2` now gets ID tokens from a session with the `openid` scope explicitly
requested.

This should not be considered a breaking change, because spec-compliant OIDC
providers will already be returning ID tokens if and only if the `openid` scope
is granted.

This change makes the dependence explicit, and removes the burden on
OAuth2-based providers which require an ID token (e.g. this is done by various
default [auth
handlers](https://backstage.io/docs/auth/identity-resolver/#authhandler)) to add
`openid` to their default scopes. _That_ could carry another indirect benefit:
by removing `openid` from the default scopes for a provider, grants for
resource-specific access tokens can avoid requesting excess ID token-related
scopes.
