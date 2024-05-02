---
'@backstage/backend-dynamic-feature-service': patch
---

Updates the `scanRoot` method in the `PluginScanner` class to specifically ignore the `lost+found` directory, which is a system-generated directory used for file recovery on Unix-like systems. Skipping this directory avoids unnecessary errors.
