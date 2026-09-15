---
'@backstage/cli-module-build': patch
---

Apps that depend on `@tanstack/react-router` build again on React 18.

The library looks up React 19's `use` without importing it, so that the reference is simply absent when it runs on React 18 and the library takes its React 18 path. The bundler resolved that lookup anyway and failed the build with `'use' is not exported from 'react'`, which broke the build of any app that merely depended on the library. The export presence check is now off for that one package and still applies everywhere else, including your own source.
