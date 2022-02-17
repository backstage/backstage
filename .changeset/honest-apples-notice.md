---
'@backstage/plugin-auth-backend': minor
---

**BREAKING**: The default sign-in resolvers for all providers, if you choose to
use them, now emit the token `sub` and `ent` claims on the standard,
all-lowercase form, instead of the mixed-case form. The mixed-case form causes
problems for implementations that naively do string comparisons on refs. The end
result is that you may for example see your Backstage token `sub` claim now
become `'user:default/my-id'` instead of `'user:default/My-ID'`.

On a related note, specifically the SAML provider now correctly issues both
`sub` and `ent` claims, and on the full entity ref form instead of the short
form with only the ID.

**NOTE**: For a long time, it has been strongly recommended that you provide
your own sign-in resolver instead of using the builtin ones, and that will
become mandatory in the future.
