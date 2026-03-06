---
'@backstage/plugin-scaffolder': patch
---

Fix the display of the description in `GitlabRepoPicker`:

- Move `owner.description` helper text outside the `allowedOwners` conditional so it renders for both `Select` and `Autocomplete` modes.
- Update the `Autocomplete` label to use `fields.gitlabRepoPicker.owner.inputTitle` instead of `fields.gitlabRepoPicker.owner.title`.
