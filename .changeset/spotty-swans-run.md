---
'@backstage/cli': patch
---

The backend development setup now ignores the `"browser"` and `"module"` entry points in `package.json`, and instead always uses `"main"`.
