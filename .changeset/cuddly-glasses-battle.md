---
'@backstage/integration-react': patch
---

Remove unnecessary broad permissions from Gitlab `SCMAuth`

Newer versions of Gitlab (after 2019) do not require the broad api permissions to write to repos.
