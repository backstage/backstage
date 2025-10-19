---
'@backstage/plugin-catalog-backend-module-github': minor
'@backstage/plugin-catalog-backend-module-github-org': minor
---

Added configurable page sizes for GitHub GraphQL API queries to prevent `RESOURCE_LIMITS_EXCEEDED` errors with large GitHub organizations.

**Default Values Changed:**

To prevent `RESOURCE_LIMITS_EXCEEDED` errors by default, the page sizes have been reduced to 50% of previous values:

- `teams`: 50 → **25**
- `teamMembers`: 100 → **50**
- `organizationMembers`: 100 → **50**
- `repositories`: 50 → **25**

**New Configuration:**

You can now configure page sizes in `app-config.yaml` to customize GitHub API resource consumption:

**For `githubOrg` provider (users and teams):**

```yaml
catalog:
  providers:
    githubOrg:
      - id: production
        githubUrl: https://github.com
        orgs: ['your-org']
        schedule:
          frequency: { minutes: 30 }
          timeout: { minutes: 3 }
        # Optional: Customize page sizes (defaults shown below)
        pageSizes:
          teams: 25 # Default: 25
          teamMembers: 50 # Default: 50
          organizationMembers: 50 # Default: 50
          repositories: 25 # Default: 25
```

**For `github` provider (repositories):**

```yaml
catalog:
  providers:
    github:
      myorg:
        organization: 'your-org'
        catalogPath: '/catalog-info.yaml'
        schedule:
          frequency: { minutes: 30 }
          timeout: { minutes: 3 }
        # Optional: Customize page sizes (defaults shown below)
        pageSizes:
          repositories: 25 # Default: 25
```

**Breaking Changes:**

The default page sizes have been reduced by 50% to prevent `RESOURCE_LIMITS_EXCEEDED` errors with large organizations. This may result in:

- ✅ **More stable syncs** for large organizations (200+ teams)
- ⚠️ **Slightly more API calls** due to additional pagination
- ⚠️ **Slightly slower sync times** (typically 10-20% slower)

If you need the previous behavior, you can restore the old values in your configuration:

```yaml
pageSizes:
  teams: 50
  teamMembers: 100
  organizationMembers: 100
  repositories: 50
```

**Benefits:**

- Prevents `RESOURCE_LIMITS_EXCEEDED` errors for large GitHub organizations (200+ teams)
- Configurable per provider instance
- No performance impact for smaller organizations
- All data still synced through pagination

Resolves GitHub issue #31437
