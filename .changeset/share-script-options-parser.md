---
'@backstage/cli-node': minor
---

Exported `createScriptOptionsParser` so CLI modules other than the lint module can parse options from package.json scripts. It now also accepts an exact script prefix string, for commands that are not invoked through `backstage-cli`.
