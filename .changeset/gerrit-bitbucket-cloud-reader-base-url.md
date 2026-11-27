---
'@backstage/integration': patch
'@backstage/backend-defaults': patch
---

The Gerrit and Bitbucket Cloud URL readers now derive the base of their request URLs from the parsed URL rather than from the raw URL string.
