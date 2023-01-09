---
'@backstage/plugin-catalog-backend-module-msgraph': minor
---

Improved performance by reducing the number of calls being made to the Microsoft Graph API.

- Increased the number of rows returned at a time from 100 to 999.
- Load user data in batches when getting users by group membership, rather than making individual calls per user.

Improved logging to provide more information as the task progresses.

Added support for loading only users and only groups
If you don't add any configuration for groups or users, then they won't be ingested.
You can restore the previous behavior by providing empty (do you want to include disabled accounts and guest users?)

```yaml
microsoftGraphOrg:
  default:
  # ...
  userGroupMember:
    filter: ' '
  group:
    filter: ' '
```
