---
<<<<<<< HEAD
'@backstage/plugin-auth-backend': minor
---

**BREAKING**: The `saml` provider has been migrated from `passport-saml` to `@node-saml/passport-saml`.

This comes with breaking changes to config options:

- `audience` is now mandatory
- `wantAuthnResponseSigned` is now exposed and defaults to `true`
- `wantAssertionsSigned` is now exposed and defaults to `true`
=======
'@backstage/plugin-auth-backend': patch
---

migrate from 'passport-saml' to '@node-saml/passport-saml'
>>>>>>> 653fd33301e (chore(plugins/auth-backend): migrate from passport-saml package to @node-saml/passport-saml)
