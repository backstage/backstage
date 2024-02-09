---
'@backstage/backend-common': minor
---

**BREAKING**: `A gitilesBaseUrl` must be provided for the Gerrit integration to work.
You can disable this check by setting `DISABLE_GERRIT_GITILES_REQUIREMENT=1` but
this will be removed in a future release. If you are not able to use the Gitiles
Gerrit plugin, please open an issue towards `https://github.com/backstage/backstage`
