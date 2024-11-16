---
'@backstage/plugin-app-backend': patch
---

The `index.html` templating is now done and served from memory rather than written to the filesystem. This means that you can now use config injection with a read-only filesystem, and you no longer need to use the `app.disableConfigInjection` flag.
