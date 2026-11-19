---
'@backstage/plugin-auth-backend-module-microsoft-provider': minor
---

Added support for authenticating the App Registration with a certificate instead of a client secret. Configure either `clientCertificate` (PEM including the private key) or `clientCertificatePath` in place of `clientSecret`; the provider then sends a certificate-signed client assertion (`private_key_jwt`) when exchanging authorization codes and refreshing tokens.
