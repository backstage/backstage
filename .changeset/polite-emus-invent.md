---
'@backstage/backend-defaults': minor
---

**BREAKING**: The `workdir` argument have been removed from The `GerritUrlReader` constructor.

**BREAKING**: The Gerrit `readTree` implementation will now only use the Gitiles api. Support
for using git to clone the repo has been removed.
