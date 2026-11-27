---
'@backstage/plugin-scaffolder-backend-module-gitlab': minor
---

**BREAKING**: The `gitlab:projectAccessToken:create` and `gitlab:projectDeployToken:create` actions now require the `variableKey` input and always store the generated token as a masked GitLab CI/CD variable. The raw `access_token` and `deploy_token` outputs have been removed. To migrate, add `variableKey` to these steps and replace any use of `steps.<id>.output.access_token` or `steps.<id>.output.deploy_token` (for example, a follow-up `gitlab:projectVariable:create` step) with the CI/CD variable. The actions return the variable name as `variableKey`, and the deploy token action still returns `user`.

The CI/CD variable is always created in the same project as the token. Templates that passed the raw token to another project, a group variable, or an external secret store can no longer do so.
