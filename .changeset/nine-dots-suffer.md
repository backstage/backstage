---
'@backstage/create-app': patch
---

Updated the app template to no longer include the `--no-private` flag for the `create-plugin` command.

To apply this change to an existing application, remove the `--no-private` flag from the `create-plugin` command in the root `package.json`:

```diff
   "prettier:check": "prettier --check .",
-  "create-plugin": "backstage-cli create-plugin --scope internal --no-private",
+  "create-plugin": "backstage-cli create-plugin --scope internal",
   "remove-plugin": "backstage-cli remove-plugin"
```
