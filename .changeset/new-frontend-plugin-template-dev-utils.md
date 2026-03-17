---
'@backstage/cli': patch
'@backstage/cli-module-new': patch
---

Updated the new frontend plugin template to use `@backstage/frontend-dev-utils` in its `dev/` entry point instead of wiring `createApp` manually. Generated plugins now get the same dev app helper setup as the built-in examples.
