---
'@backstage/techdocs-common': patch
'@backstage/plugin-techdocs': patch
'@backstage/plugin-techdocs-backend': patch
---

Create type for TechDocsMetadata (#3716)

This change introduces a new type (TechDocsMetadata) in packages/techdocs-common. This type is then introduced in the endpoint response in techdocs-backend and in the api interface in techdocs (frontend).
