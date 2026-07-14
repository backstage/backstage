---
'@backstage/plugin-auth-backend': patch
---

Promoted Client ID Metadata Documents (CIMD) to the stable `auth.clientIdMetadataDocuments` configuration. The previous `auth.experimentalClientIdMetadataDocuments` key remains supported as a deprecated alias. Dynamic Client Registration now logs a deprecation warning when enabled and users should migrate to CIMD.
