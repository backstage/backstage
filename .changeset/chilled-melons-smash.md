---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

Add `github:branch-protection:create` scaffolder action to set branch protection on an existing repository. Example usage:

```yaml
- id: set-branch-protection
  name: Set Branch Protection
  action: github:branch-protection:create
  input:
    repoUrl: 'github.com?repo=backstage&owner=backstage'
    branch: master
    enforceAdmins: true # default
    requiredApprovingReviewCount: 1 # default
    requireBranchesToBeUpToDate: true # default
    requireCodeOwnerReviews: true
    dismissStaleReviews: true
    requiredConversationResolution: true
```
