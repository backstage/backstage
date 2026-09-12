# @backstage/cli-module-package-manager-yarn

## 0.1.1-next.1

### Patch Changes

- 064c2de: Updated the Yarn tooling dependencies to versions that avoid known security vulnerabilities.

## 0.1.1-next.0

### Patch Changes

- de957f6: Added `@backstage/cli-module-package-manager-yarn` with `backstage-cli pm
verify-patches` to validate Yarn patch references, local patch files,
  lockfile consistency, and patched Backstage package versions against the
  selected Backstage release. The command is included in
  `@backstage/cli-defaults`.
