---
'@backstage/plugin-scaffolder-backend': minor
---

Fixed bug in `publish:github` action that didn't permit to add users as collaborators.
This fix required changing the way parameters are passed to the action.
In order to add a team as collaborator, now you must use the `team` field instead of `username`.
In order to add a user as collaborator, you must use the `user` field.

It's still possible to use the field `username` but is deprecated in favor of `team`.

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
        user: my_username
```
