---
'@backstage/plugin-auth-backend': patch
---

Tokens issued through the OIDC authorization code flow now carry an `azp` claim naming the client they were issued to, and the claim is preserved when the token is refreshed. Previously these tokens were indistinguishable from tokens issued by an interactive sign-in, so a backend could not tell which client a request was coming from. Tokens from an interactive sign-in are not affected.
