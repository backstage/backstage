---
'@backstage/cli-module-build': patch
---

Apps that depend on `@tanstack/react-router` build again on React 18.

The library reads React 19's `use` through a namespace member lookup rather than importing it, so that on React 18 the reference is absent at runtime and the library takes its React 18 path. The bundler resolved that lookup statically anyway and failed the build with `'use' is not exported from 'react'`, which turned any app that merely depended on the library into one that could not be built. The export presence check is now off for that package alone and stays in force everywhere else, including your own source.
