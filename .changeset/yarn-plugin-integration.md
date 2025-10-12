---
'@backstage/cli': patch
---

Added automatic detection and support for the Backstage Yarn plugin when generating new packages with `yarn new`. When the plugin is installed, new packages will automatically use `backstage:^` ranges for `@backstage/*` dependencies.
