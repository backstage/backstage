---
'@backstage/cli': minor
---

**BREAKING**: The CLI no longer includes or loads a default set of commands. Add `@backstage/cli-defaults` as a direct root dependency to retain all standard commands, or add selected `@backstage/cli-module-*` packages instead.

Legacy configuration paths that forward to build or test modules now resolve the owning module from the target repository. Install the corresponding module directly or through `@backstage/cli-defaults` to keep using these paths.
