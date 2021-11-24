---
'@backstage/cli': patch
---

Switch the default test coverage provider from the jest default one to `'v8'`, which provides much better coverage information when using the default Backstage test setup. This is considered a bug fix as the current coverage information is often very inaccurate.
