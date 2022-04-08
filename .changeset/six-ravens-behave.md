---
'@backstage/plugin-auth-backend': minor
---

**BREAKING**: All auth providers have had their default sign-in resolvers removed. This means that if you want to use a particular provider for sign-in, you must provide an explicit sign-in resolver. For more information on how to configure sign-in resolvers, see the [sign-in resolver documentation](https://backstage.io/docs/auth/identity-resolver).
