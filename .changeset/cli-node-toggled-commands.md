---
'@backstage/cli-node': patch
---

CLI modules can now register `package` commands with `addPackageCommand` and an optional `if` condition, so that several modules can provide the same command and the right one is chosen for each package. At most one module can provide the command without `if`, which acts as the fallback for packages where no other module is enabled.
