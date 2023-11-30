---
'@backstage/repo-tools': patch
---

The `api-reports` command now checks for api report files that no longer apply.
If it finds such files, it's treated basically the same as report errors do, and
the check fails.

For example, if you had an `api-report-alpha.md` but then removed the alpha
export, the reports generator would now report that this file needs to be
deleted.
