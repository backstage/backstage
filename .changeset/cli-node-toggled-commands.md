---
'@backstage/cli-node': patch
---

CLI modules can now set `isEnabled` on `package` commands, so that several modules can provide the same command and the right one is chosen for each package. At most one module can provide the command without `isEnabled`, which acts as the fallback for packages where no other module is enabled.
