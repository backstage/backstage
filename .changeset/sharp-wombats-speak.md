---
'@backstage/plugin-auth-backend': minor
---

Allow additional user-defined scopes for Okta auth in config yaml

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
        additionalScopes: groups # Optional
```

- Accept a new additionalScope option during okta creation with `createAuthProviderIntegration`
- Passes the the user-defined `additionalScopes` as an option to `OktaAuthProvider`
- Add `additionalScopes` as an option for `OktaAuthProvider`
- Set `scope` in `OktaAuthProvider` to the combined value of current scopes combined with the user-defined `additionalScopes` passed as an `option`
- Update the `start` and `refresh` methods to use the new combiend `scope` from `OktaAuthProvider` rather than `scope` from the request
