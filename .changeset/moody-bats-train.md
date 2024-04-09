---
'@backstage/backend-app-api': patch
---

Service-to-service authentication has been improved.

Each plugin now has the capability to generate its own signing keys for token issuance. The generated public keys are stored in a database, and they are made accessible through a newly created endpoint: `/.backstage/auth/v1/jwks.json`.

`AuthService` can now issue tokens with a reduced scope using the `getPluginRequestToken` method. This improvement enables plugins to identify the plugin originating the request.
