---
'@backstage/repo-tools': patch
---

Add new command options to the `api-report`

- added `--allow-warnings`, `-a` to continue processing packages if selected packages have warnings
- added `--allow-all-warnings` to continue processing packages any packages have warnings
- added `--omit-messages`, `-o` to pass some warnings messages code to be omitted from the api-report.md files
- The `paths` argument for this command now takes as default the value on `workspaces.packages` inside the root package.json
- change the path resolution to use the `@backstage/cli-common` packages instead
