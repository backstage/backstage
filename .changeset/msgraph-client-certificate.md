---
'@backstage/plugin-catalog-backend-module-msgraph': minor
---

Added support for authenticating with a client certificate instead of a client secret. Configure `clientId` together with either `clientCertificate` (PEM including the private key) or `clientCertificatePath` to authenticate an App Registration with a certificate. Only one of `clientSecret`, `clientCertificate` and `clientCertificatePath` can be set.
