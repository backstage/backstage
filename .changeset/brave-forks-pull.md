---
'@backstage/backend-common': patch
---

Support commit hashes at `GithubUrlReader.readTree/search` additionally to branch names.

Additionally, this will reduce the number of API calls from 2 to 1 for retrieving the "repo details"
for all cases besides when the default branch has to be resolved and used
(e.g., repo URL without any branch or commit hash).
