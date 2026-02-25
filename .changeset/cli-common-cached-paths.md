---
'@backstage/cli-common': minor
---

Added `targetPaths` and `findOwnPaths` as replacements for `findPaths`, with a cleaner separation between target project paths and package-relative paths.

To migrate existing `findPaths` usage:

```ts
// Before
import { findPaths } from '@backstage/cli-common';
const paths = findPaths(__dirname);

// After — for target project paths (cwd-based):
import { targetPaths } from '@backstage/cli-common';
// paths.targetDir    → targetPaths.dir
// paths.targetRoot   → targetPaths.rootDir
// paths.resolveTarget('src')      → targetPaths.resolve('src')
// paths.resolveTargetRoot('yarn.lock') → targetPaths.resolveRoot('yarn.lock')

// After — for package-relative paths:
import { findOwnPaths } from '@backstage/cli-common';
const own = findOwnPaths(__dirname);
// paths.ownDir       → own.dir
// paths.ownRoot      → own.rootDir
// paths.resolveOwn('config/jest.js')    → own.resolve('config/jest.js')
// paths.resolveOwnRoot('tsconfig.json') → own.resolveRoot('tsconfig.json')
```
