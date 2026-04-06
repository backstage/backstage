---
'@backstage/plugin-auth-backend-module-auth0-provider': minor
---

Added federated logout support. Set `federatedLogout: true` in the Auth0 provider config to clear both the Auth0 session and any upstream IdP session on sign-out. The authenticator returns a logout URL that redirects the browser to Auth0's `/v2/logout?federated` endpoint, ensuring users must fully re-authenticate after signing out.
