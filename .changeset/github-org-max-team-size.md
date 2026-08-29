---
'@backstage/plugin-catalog-backend-module-github-org': minor
'@backstage/plugin-catalog-backend-module-github': minor
---

Adds a new `queryLimits.teamMembers` configuration option for the GitHub Org provider, which caps the number of team members fetched and imported into the catalog. This helps avoid catalog refresh timeouts for organizations with teams that have thousands of members.

```yaml title="app-config.yaml"
catalog:
  providers:
    githubOrg:
      - id: github
        githubUrl: https://github.com
        orgs: ['organization-1', 'organization-2', 'organization-3']
        schedule:
          initialDelay: { seconds: 30 }
          frequency: { hours: 1 }
          timeout: { minutes: 50 }
        pageSizes:
          teams: 25
          teamMembers: 50
          organizationMembers: 50
+       queryLimits:
+         teamMembers: 300
      - id: ghe
        githubUrl: https://ghe.mycompany.com
        orgs: ['internal-1', 'internal-2', 'internal-3']
        schedule:
          initialDelay: { seconds: 30 }
          frequency: { hours: 1 }
          timeout: { minutes: 50 }
        excludeSuspendedUsers: true
```
