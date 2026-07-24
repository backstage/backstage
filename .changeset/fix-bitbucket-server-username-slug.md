---
'@backstage/plugin-auth-backend-module-bitbucket-server-provider': patch
---

Fixed sign-in failing for users whose Bitbucket Server username differs from their user slug (for example when authenticated via SSO or LDAP). The provider now resolves the logged-in user's slug before fetching their profile, instead of assuming the username reported by Bitbucket Server can be used directly.
