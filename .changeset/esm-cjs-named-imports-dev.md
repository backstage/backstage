---
'@backstage/cli-node': patch
---

ES modules run with the Backstage Node.js transform, for example through `backstage-cli package start`, can now use named imports from CommonJS packages whose exports Node.js can't detect, such as `import { get } from 'lodash'` or `import { readJson } from 'fs-extra'`. Previously these imports failed with a "Named export not found" error. This requires Node.js v22.15 or later; older versions keep the previous behavior.
