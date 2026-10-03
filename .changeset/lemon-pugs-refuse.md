---
'@backstage/repo-tools': minor
---

The `type-deps` command now exits with an error when it has no built type declarations to check, rather than passing silently. This catches the case where the command runs before the packages have been built, which made the check report success without inspecting anything. It also prints how many packages it skipped for having no declarations in `dist`. Pass `--allow-empty` to keep the previous behavior in repos where checking nothing is expected.
