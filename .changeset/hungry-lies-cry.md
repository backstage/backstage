---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

The gitlab org data integration now makes use of the GraphQL API to determine
the relationships between imported User and Group entities, effectively making
this integration usable without an administrator account's Personal Access
Token.
