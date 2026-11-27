---
'@backstage/backend-defaults': patch
---

Added an experimental `backend.auth.experimentalPluginTokenIssuer` configuration option. When enabled, plugin-to-plugin tokens include an `iss` (issuer) claim set to the external base URL of the issuing plugin. Backends on older versions ignore the claim, so the option can be enabled at any time.
