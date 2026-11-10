---
'@backstage/plugin-catalog-backend': patch
---

Improved repository validation for catalog entity placeholders on Azure DevOps. Placeholder-driven reads on a configured Azure DevOps integration are now restricted to the entity's own repository on every Azure DevOps host shape, including legacy `{org}.visualstudio.com` hosts and Azure DevOps Server hosts, and targets that cannot be attributed to a repository are rejected as well.
