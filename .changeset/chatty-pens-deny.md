---
'@backstage/cli': patch
---

backstage-cli create-plugin command will now generate packages that include `src` directory in their distribution bundles. We changed the plugin template to improve the debugging experience by ensuring that the debugger shows TypeScript source code rather than displaying compiled code.
