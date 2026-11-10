---
'@backstage/integration': patch
---

Fixed a bug in AzureURL where legacy tfs URLs containing "/" characters in the owner portion were incorrectly parsed, resulting in invalid output URLs.
