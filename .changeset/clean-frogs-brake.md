---
'@backstage/create-app': patch
---

Adding .DS_Store pattern to .gitignore in Scaffolded Backstage App. To migrate an existing app that pattern should be added manually.

```diff
+# macOS
+.DS_Store
```
