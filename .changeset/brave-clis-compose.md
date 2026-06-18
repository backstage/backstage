---
'@backstage/cli': minor
---

**BREAKING**: The CLI no longer includes or loads a default set of commands. Add `@backstage/cli-defaults` as a direct root dependency to retain all standard commands, or add selected `@backstage/cli-module-*` packages instead.

Legacy configuration paths that forward to build or test modules now resolve the owning module from the target repository. If you use these paths directly, add the corresponding module as a direct root dependency.
