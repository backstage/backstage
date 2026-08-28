---
'@backstage/plugin-catalog-backend-module-github': patch
---

Added debug logging to help troubleshoot missing GitHub App installations. When a GitHub App is not installed for an organization, the GithubMultiOrgEntityProvider will now log a debug message with guidance on how to resolve the issue.
