---
'@backstage/backend-defaults': patch
---

The `jwks` external access method now supports an optional `claims` config option, letting you restrict which callers are accepted based on the claims in their JWT. Each entry maps a claim name to a single allowed value or a list of allowed values, and a token is accepted only if every listed claim is present and matches one of its allowed values. When a claim's value is an array or a space-delimited string (such as an OAuth `scope`), it is enough that one of those values matches. These checks apply in addition to the existing `issuer`, `algorithm`, and `audience` checks.
