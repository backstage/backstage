---
'@backstage/plugin-scaffolder-backend': patch
---

Removed the native addon requirement from scaffolder template rendering. Templates now run through a TypeScript interpreter, and the backend no longer needs the `--no-node-snapshot` Node.js option.
