---
'@backstage/repo-tools': minor
---

Add new command options to the `api-report`

- added `--allow-warnings`, `-a` to continue processing packages if some packages have warnings
- added `--omit-messages`, `-o` to pass some warnings messages code to be omitted from the api-report.md files
- added `--paths`, `-p` to select packages path to process
- The `paths` argument for this command now takes as default the value on `workspaces.packages` inside the root package.json
- Removed the `paths` argument replaced by the option `--paths`
- change the path resolution to use the `@backstage/cli-common` packages instead
