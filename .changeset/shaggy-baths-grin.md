---
'@backstage/cli-module-actions': minor
---

The `actions list` command now returns partial results when some plugin sources fail, instead of failing entirely. Failed sources are reported as warnings. Added `--output json` flag for structured output including an `errors` array.
