---
'@backstage/cli': minor
---

**BREAKING**: Removed the following deprecated package commands:

- `app:build` - Use `package build` instead
- `app:serve` - Use `package start` instead
- `backend:build` - Use `package build` instead
- `backend:bundle` - Use `package build` instead
- `backend:dev` - Use `package start` instead
- `plugin:build` - Use `package build` instead
- `plugin:serve` - Use `package start` instead
- `build` - Use `package build` instead
- `lint` - Use `package lint` instead
- `prepack` - Use `package prepack` instead
- `postpack` - Use `package postpack` instead

In order to replace these you need to have [migrated to using package roles](https://backstage.io/docs/tutorials/package-role-migration).
