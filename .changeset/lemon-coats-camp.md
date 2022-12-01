---
'@backstage/repo-tools': minor
---

Add new command options to the `api-report`

- added `--allowWarnings` to continue processing packages if some packages have warnings
- added `--omitMessages` to pass some warnings messages code to be omitted from the api-report.md files
- The `paths` argument for this command now takes as default the value on `workspaces.packages` inside the root package.json
- The `paths` argument now allow glob patterns
- change the path resolution to use the `@backstage/cli-common` packages instead
