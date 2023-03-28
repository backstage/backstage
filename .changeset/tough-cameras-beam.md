---
'@backstage/plugin-scaffolder-backend': minor
---

Provide some more default filters out of the box and refactoring how the filters are applied to the `SecureTemplater`.

- `parseEntityRef` will take an string entity triplet and return a parsed object.
- `pick` will allow you to reference a specific property in the piped object.

So you can now combine things like this: `${{ parameters.entity | parseEntityRef | pick('name') }}` to get the name of a specific entity, or `${{ parameters.repoUrl | parseRepoUrl | pick('owner') }}` to get the owner of a repo.
