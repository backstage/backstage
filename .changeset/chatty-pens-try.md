---
'@backstage/integration': patch
---

Return an empty token rather than fail where the owner is not in the allowed installation owners
for a GitHub app. This allows anonymous access to public files in the organisation.
