---
'@backstage/create-app': patch
---

New apps now have improved protection against supply chain attacks by default.
Yarn 4.14.1 defaults to `enableScripts: false`, which prevents packages from running install scripts unless explicitly permitted.

If you need to temporarily revert this behaviour, you can add `enableScripts: true` to your `.yarnrc.yml`.

Packages that require native compilation must be opted in via `dependenciesMeta` in `package.json`, notably for `better-sqlite3` and `isolated-vm`:

```json
"dependenciesMeta": {
  "better-sqlite3": {
    "built": true
  },
  "isolated-vm": {
    "built": true
  }
}
```
