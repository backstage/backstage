---
'@backstage/integration': minor
---

Added a `ClientCertificate` credential kind for the Azure DevOps integration. Configure `clientId`, `tenantId` and either `clientCertificate` (PEM including the private key) or `clientCertificatePath` to authenticate an App Registration with a certificate instead of a client secret.
