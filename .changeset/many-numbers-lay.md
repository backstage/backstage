---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Added a secure `variableKey` input to `gitlab:projectAccessToken:create` and `gitlab:projectDeployToken:create` actions. When provided, the generated token is stored directly as a masked GitLab CI/CD variable instead of being exposed in task outputs and checkpoint state. The raw token outputs are now deprecated when `variableKey` is not used.
