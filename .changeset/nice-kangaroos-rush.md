---
'yarn-plugin-backstage': patch
---

Switch to using `reduceDependency` hook to replace `backstage:^` versions. This
makes the same yarn.lock file valid whether or not the plugin is installed.
