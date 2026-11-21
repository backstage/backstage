---
'@backstage/repo-tools': patch
---

`package schema openapi generate` now writes an `.openapi-manifest.json` file into each generated directory, and `repo schema openapi validate` uses it to report generated server and client code that is out of date with its `openapi.yaml` or has been edited by hand, along with the command that fixes it. Directories without a manifest, or generated with a different generator version, only produce a warning.
