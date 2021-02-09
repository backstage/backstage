---
'example-app': patch
'@backstage/plugin-auth-backend': patch
---

Add configurable `scope` for oauth2 auth provider.

Some OAuth2 providers require certain scopes to facilitate a user sign-in using the Authorization Code flow.
This change adds the optional `scope` key to auth.providers.oauth2. An example is:

```yaml
auth:
  providers:
    oauth2:
      development:
        clientId:
          $env: DEV_OAUTH2_CLIENT_ID
        clientSecret:
          $env: DEV_OAUTH2_CLIENT_SECRET
        authorizationUrl:
          $env: DEV_OAUTH2_AUTH_URL
        tokenUrl:
          $env: DEV_OAUTH2_TOKEN_URL
        scope: saml-login-selector openid profile email
```

This tells the OAuth 2.0 AS to perform a SAML login and return OIDC information include the `profile`
and `email` claims as part of the ID Token.
