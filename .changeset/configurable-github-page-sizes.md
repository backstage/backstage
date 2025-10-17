---
'@backstage/plugin-catalog-backend-module-github': patch
---

Added configurable page sizes for GitHub API queries to help avoid RESOURCE_LIMITS_EXCEEDED errors when syncing large organizations. Default page sizes have been reduced by 50% to work within GitHub's September 2025 API resource limits. Page sizes can now be configured via app-config.yaml:

```yaml
catalog:
  providers:
    github:
      production:
        organization: myorg
        pageSizes:
          teams: 25 # default: 25
          members: 50 # default: 50
          repositories: 25 # default: 25
          repositoryTopics: 50 # default: 50
```
