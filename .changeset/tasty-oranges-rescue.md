---
'@backstage/plugin-auth-backend': minor
---

migrate from 'passport-saml' to '@node-saml/passport-saml'  
This comes with breaking changes to config options:

- `audience` is no mandatory
- `wantAuthnResponseSigned` is now exposed and defaults to `true`
- `wantAssertionsSigned` is now exposed and defaults to `true`
