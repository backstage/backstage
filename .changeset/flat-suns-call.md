---
'@backstage/plugin-auth-backend': patch
---

Add support for the majority of the Core configurations for Passport-SAML.

These configuration keys are supported:

- entryPoint
- issuer
- cert
- privateKey
- decryptionPvk
- signatureAlgorithm
- digestAlgorithm

As part of this change, there is also a fix to the redirection behaviour when doing load balancing and HTTPS termination - the application's baseUrl is used to generate the callback URL. For properly configured Backstage installations, no changes are necessary, and the baseUrl is respected.
