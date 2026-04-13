---
'@backstage/plugin-auth-backend-module-auth0-provider': minor
---

Sign-out now redirects the browser to Auth0's `/v2/logout` endpoint, clearing the Auth0 session cookie so that the next sign-in creates a new Auth0 session. Previously, only the Backstage session was cleared, allowing users to sign back in without going through Auth0 logout first.

Set `federatedLogout: true` in the Auth0 provider config to additionally clear the upstream IdP session (e.g. Okta, Google). This is what guarantees a full re-login across the entire SSO chain and may require users to re-enter credentials.
