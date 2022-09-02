---
'@backstage/create-app': patch
---

Added `yarn new` as one of the scripts installed by default, which calls `backstage-cli new`. This script replaces `create-plugin`, which you can now remove if you want to. It is kept in the `create-app` template for backwards compatibility.

The `remove-plugin` command has been removed, as it has been removed from the Backstage CLI.

To apply these changes to an existing app, make the following change to the root `package.json`:

```diff
-    "remove-plugin": "backstage-cli remove-plugin"
+    "new": "backstage-cli new --scope internal"
```
