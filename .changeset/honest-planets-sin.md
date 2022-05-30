---
'@backstage/plugin-scaffolder-backend': minor
---

**BREAKING** Fixed bug in `publish:github` action that didn't permit to add users as collaborators.
This fix required changing the way parameters are passed to the action.
In order to add a team as collaborator, now you must use the `team` field instead of `username`.
In order to add a user as collaborator, you must use the `username` field.

```yaml
- id: publish
  name: Publish
  action: publish:github
  input:
    allowedHosts: ['github.com']
    repoUrl: ...
    collaborators:
      - access: ...
        team: my_team
      - access: ...
        username: my_username
```
