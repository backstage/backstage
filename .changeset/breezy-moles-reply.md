---
'@backstage/plugin-auth-backend': minor
---

Remove undocumented scope (default) from the OIDC auth provider which was breaking some identity services. If your app relied on this scope, you can manually specify it by adding a new factory in `packages/app/src/apis.ts`:

```
export const apis = [
  createApiFactory({
    api: oidcAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      OAuth2.create({
        discoveryApi,
        oauthRequestApi,
        provider: {
          id: 'oidc',
          title: 'Your Identity Provider',
          icon: OAuth2Icon,
        },
        defaultScopes: [
          'default',
          'openid',
          'email',
          'offline_access',
        ],
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
];
```
