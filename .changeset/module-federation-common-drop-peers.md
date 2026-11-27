---
'@backstage/module-federation-common': patch
---

Removed the React, React Router, Material UI and Emotion peer dependencies. The package only lists these libraries by name; the shared modules are imported and resolved from the app being built. Package managers no longer install them, or warn that they are missing, for the Backstage CLI.
