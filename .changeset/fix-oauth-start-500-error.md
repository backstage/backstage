---
'@backstage/plugin-auth-node': patch
---

Fix OAuth start handler crashing with a 500 error on malformed origins, now returns a 400 error.
