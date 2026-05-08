---
'@backstage/frontend-app-api': patch
---

The `if` predicate now authorizes referenced permissions through the permission backend's name-based authorize endpoint in a single batched request. Predicates that gate on attribute-aware policies (for example, `attributes.action === 'create'`) now evaluate correctly because the backend hydrates the registered `Permission` — including its `attributes` and resource type — before running the policy.
