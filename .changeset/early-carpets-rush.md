---
'@backstage/cli': patch
---

Add missing peer/dev dependencies to the frontend plugin template.

`react-dom` was not declared as a peer dependency, causing module resolution
errors when generating plugins outside a Backstage monorepo. This adds
`react-dom` to `peerDependencies` (for consuming apps) and `devDependencies`
(for local development). `react-router-dom` is also added to `peerDependencies` (for consuming apps) and `devDependencies`
to support routing during plugin development.

Fixes:

- Module not found: Can't resolve 'react-dom'
- Module not found: Can't resolve 'react-router-dom'
