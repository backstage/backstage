---
'@backstage/plugin-app': patch
---

Declared the dependencies of internally bundled code so that the package works with strict `node_modules` layouts, and stopped loading the default API implementations just to install the default icons.
