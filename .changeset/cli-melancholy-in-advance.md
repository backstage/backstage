---
'@backstage/cli': patch
---

The packing process when running `build-workspace` with the `--alwaysYarnPack` flag now respects the `BACKSTAGE_CLI_BUILD_PARALLEL` environment variable, defaulting parallel work limits based on CPU availability.
