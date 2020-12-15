---
'@backstage/plugin-catalog-backend': patch
---

Support `profile` of groups including `displayName` and `email` in
`MicrosoftGraphOrgReaderProcessor`. Importing `picture` doesn't work yet, as
the Microsoft Graph API does not expose them correctly.
