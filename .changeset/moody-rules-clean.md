---
'@backstage/core-api': patch
---

Add a small delay in the login popup handler when messages seem delayed, in an attempt to handle a race condition that some users have reported.
