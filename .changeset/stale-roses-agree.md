---
'@backstage/plugin-auth-backend-module-oidc-proxy-provider': patch
---

Add the `oidcProxy` auth backend-module proxy provider. Useful to sign-in users who already have an id token provided in a request header by an identity aware proxy. Built for use with the Holos platform, but generally useful and intended for any platform implementing an [External Authorization](https://istio.io/latest/docs/tasks/security/authorization/authz-custom/) style design.
