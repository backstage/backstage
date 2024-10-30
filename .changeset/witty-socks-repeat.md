---
'@backstage/cli': patch
---

Added a new `--link <workspace-path>` option for frontend builds that allow you to override module resolution to link in an external workspace at runtime.

As part of this change the Webpack linked workspace resolution plugin for frontend builds has been removed. It was in place to support the old workspace linking where it was done by Yarn, which is no longer a working option.
