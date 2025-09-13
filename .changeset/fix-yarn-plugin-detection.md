---
'@backstage/cli': patch
---

Fixed `yarn new` to only use `backstage:^` version format for @backstage/* dependencies when the Backstage yarn plugin is actually installed. When the plugin is not detected, it now falls back to using standard version ranges to ensure compatibility with environments that don't use the plugin.