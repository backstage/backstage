---
'@backstage/cli': patch
---

Introduced a new experimental test configuration with a number of changes. It switches the coverage provider from `v8` to the default Babel provider, along with always enabling source maps in the Sucrase transform. It also adds a custom module loader that caches both file transforms and VM script objects across all projects in a test run, which provides a big performance boost when running tests from the project root, increasing speed and reducing memory usage.

This new configuration is not enabled by default. It is enabled by setting the environment variable `BACKSTAGE_NEXT_TESTS` to a non-empty value.
