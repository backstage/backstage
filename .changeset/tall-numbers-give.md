---
'@backstage/integration': patch
---

Fixed a bug in AzureURL where legacy Azure DevOps Server URLs were incorrectly parsed when the owner variable contained "/" characters, resulting in invalid output URLs.
