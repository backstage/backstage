---
'@backstage/plugin-auth-backend': minor
---

Allow user-defined scopes for Okta auth in config yaml

Example `app-config.yaml` excerpt

```yml
auth:
  environment: development
  providers:
    okta:
      development:
        clientId: ${AUTH_OKTA_CLIENT_ID}
        clientSecret: ${AUTH_OKTA_CLIENT_SECRET}
        audience: ${AUTH_OKTA_DOMAIN}
        authServerId: ${AUTH_OKTA_AUTH_SERVER_ID} # Optional
        idp: ${AUTH_OKTA_IDP} # Optional
        # https://developer.okta.com/docs/reference/api/oidc/#scope-dependent-claims-not-always-returned
        scope: openid profile email offline_access groups # Optional
```

- Accept a new scope option during okta creation with `createAuthProviderIntegration`
- Pass the user-defined `scope` as an option to `OktaAuthProvider`
- Add `scope` as an option for `OktaAuthProvider`
- Set `scope` in `OktaAuthProvider` to the `scope` passed as an `option` or a default of `'openid email profile offline_access'` if a user-defined option is not provided
- Update the `start` and `refresh` methods to use `scope` from `OktaAuthProvider` rather than `scope` from the request
