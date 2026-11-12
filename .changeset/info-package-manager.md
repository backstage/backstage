---
'@backstage/cli-module-info': patch
---

`info` now includes a `packageManager` field with the name and version of the package manager in its JSON output. For Yarn projects the `yarn` field is still there, and the text output is unchanged. When the lockfile can't be read, `info` warns and leaves out the installed packages instead of failing. Local packages are now read from the workspace, so `info` also lists the ones with a `backstage` field that aren't linked into the root `node_modules`.
