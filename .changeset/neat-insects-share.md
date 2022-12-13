---
'@backstage/cli': minor
---

The Jest configuration that was previously enabled with `BACKSTAGE_NEXT_TESTS` is now enabled by default. To revert to the old configuration you can now instead set `BACKSTAGE_OLD_TESTS`.

This new configuration uses the `babel` coverage provider rather than `v8`. It used to be that `v8` worked better when using Sucrase for transpilation, but now that we have switched to SWC, `babel` seems to work better. In addition, the new configuration also enables source maps by default, as they no longer have a negative impact on code coverage accuracy, and it also enables a modified Jest runtime with additional caching of script objects.
