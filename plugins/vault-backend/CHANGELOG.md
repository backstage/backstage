# @backstage/plugin-vault-backend

## 0.4.3-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-vault-node@0.1.3-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-vault-node@0.1.3-next.1

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-vault-node@0.1.3-next.0

## 0.4.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/backend-tasks@0.5.14
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-vault-node@0.1.2

## 0.4.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-vault-node@0.1.2-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-vault-node@0.1.2-next.1

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-vault-node@0.1.2-next.0

## 0.4.1

### Patch Changes

- b7de76a: Updated to test using PostgreSQL 12 and 16
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-vault-node@0.1.1

## 0.4.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-vault-node@0.1.1-next.3

## 0.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-vault-node@0.1.1-next.2

## 0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-vault-node@0.1.1-next.1

## 0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-vault-node@0.1.1-next.0

## 0.4.0

### Minor Changes

- a873a32a1f: Added support for the [new backend system](https://backstage.io/docs/backend-system/).

  In your `packages/backend/src/index.ts` make the following changes:

  ```diff
    import { createBackend } from '@backstage/backend-defaults';
    const backend = createBackend();
    // ... other feature additions
  + backend.add(import('@backstage/plugin-vault-backend');
    backend.start();
  ```

  If you use the new backend system, the token renewal task can be defined via configuration file:

  ```diff
  vault:
    baseUrl: <BASE_URL>
    token: <TOKEN>
    schedule:
  +   frequency: ...
  +   timeout: ...
  +   # Other schedule options, such as scope or initialDelay
  ```

  If the `schedule` is omitted or set to `false` no token renewal task will be scheduled.
  If the value of `schedule` is set to `true` the renew will be scheduled hourly (the default).
  In other cases (like in the diff above), the defined schedule will be used.

  **DEPRECATIONS**: The interface `VaultApi` and the type `VaultSecret` are now deprecated. Import them from `@backstage/plugin-vault-node`.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-vault-node@0.1.0
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.4.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-vault-node@0.1.0-next.2

## 0.4.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-vault-node@0.1.0-next.1

## 0.4.0-next.0

### Minor Changes

- a873a32a1f: Added support for the [new backend system](https://backstage.io/docs/backend-system/).

  In your `packages/backend/src/index.ts` make the following changes:

  ```diff
    import { createBackend } from '@backstage/backend-defaults';
    const backend = createBackend();
    // ... other feature additions
  + backend.add(import('@backstage/plugin-vault-backend');
    backend.start();
  ```

  If you use the new backend system, the token renewal task can be defined via configuration file:

  ```diff
  vault:
    baseUrl: <BASE_URL>
    token: <TOKEN>
    schedule:
  +   frequency: ...
  +   timeout: ...
  +   # Other schedule options, such as scope or initialDelay
  ```

  If the `schedule` is omitted or set to `false` no token renewal task will be scheduled.
  If the value of `schedule` is set to `true` the renew will be scheduled hourly (the default).
  In other cases (like in the diff above), the defined schedule will be used.

  **DEPRECATIONS**: The interface `VaultApi` and the type `VaultSecret` are now deprecated. Import them from `@backstage/plugin-vault-node`.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-vault-node@0.1.0-next.0
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.3.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/errors@1.2.3
  - @backstage/config@1.1.1

## 0.3.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/config@1.1.1-next.0

## 0.3.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2

## 0.3.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/errors@1.2.2

## 0.3.8

### Patch Changes

- 858a18800870: Added ability to override vault secret engine value on catalog entity level using annotation `vault.io/secrets-engine`
- Updated dependencies
  - @backstage/backend-tasks@0.5.8
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2

## 0.3.7

Skipped due to publishing issues.

## 0.3.7-next.3

### Patch Changes

- 858a18800870: Added ability to override vault secret engine value on catalog entity level using annotation `vault.io/secrets-engine`
- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3

## 0.3.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/errors@1.2.1

## 0.3.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/errors@1.2.1

## 0.3.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1

## 0.3.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-tasks@0.5.5
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1

## 0.3.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2

## 0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1

## 0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/backend-tasks@0.5.4
  - @backstage/config@1.0.8

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/config@1.0.8

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/errors@1.2.0
  - @backstage/backend-tasks@0.5.3
  - @backstage/config@1.0.8

## 0.3.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/config@1.0.7

## 0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/errors@1.1.5

## 0.3.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/config@1.0.7

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.3.0

### Minor Changes

- 5e959c9eb62: Allow generic Vault clients to be passed into the builder

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-tasks@0.5.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.3.0-next.0

### Minor Changes

- 5e959c9eb62: Allow generic Vault clients to be passed into the builder

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/errors@1.1.5

## 0.2.10

### Patch Changes

- 66b3a3956b8: Ignore the `eslint` error
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/config@1.0.7

## 0.2.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/config@1.0.7-next.0

## 0.2.10-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0

## 0.2.10-next.0

### Patch Changes

- 66b3a3956b: Ignore the `eslint` error
- Updated dependencies
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4

## 0.2.8

### Patch Changes

- 5b7cd5580d: Moving the backend-test-utils to devDependencies.
- Updated dependencies
  - @backstage/backend-common@0.18.2
  - @backstage/backend-tasks@0.4.3
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4

## 0.2.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.34-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4

## 0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/backend-test-utils@0.1.34-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.34-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/backend-tasks@0.4.3-next.0

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/backend-test-utils@0.1.32
  - @backstage/backend-tasks@0.4.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4

## 0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.32-next.2
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4

## 0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.32-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/errors@1.1.4

## 0.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/backend-test-utils@0.1.32-next.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4

## 0.2.5

### Patch Changes

- 568ae02463: Added (optional) config `vault.publicUrl` as alternative to `vault.baseUrl` for `editUrl` and `showUrl` in case `vault.baseUrl` is internal
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 7a3d2688ed: Use `express-promise-router` to catch errors properly.
  Add `403` error as a known one. It will now return a `NotAllowed` error.
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/backend-test-utils@0.1.31
  - @backstage/errors@1.1.4
  - @backstage/config@1.0.5

## 0.2.5-next.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-test-utils@0.1.31-next.4
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1

## 0.2.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/backend-test-utils@0.1.31-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1

## 0.2.5-next.2

### Patch Changes

- 568ae02463: Added (optional) config `vault.publicUrl` as alternative to `vault.baseUrl` for `editUrl` and `showUrl` in case `vault.baseUrl` is internal
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-test-utils@0.1.31-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1

## 0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/backend-test-utils@0.1.31-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1

## 0.2.5-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 7a3d2688ed: Use `express-promise-router` to catch errors properly.
  Add `403` error as a known one. It will now return a `NotAllowed` error.
- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/backend-test-utils@0.1.31-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0

## 0.2.4

### Patch Changes

- 687237da4c: Added `errorHandler()` middleware to `router` to prevent crashes caused by fatal errors in plugin backend
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/backend-tasks@0.3.7
  - @backstage/backend-test-utils@0.1.30
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/backend-test-utils@0.1.30-next.1
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/backend-test-utils@0.1.30-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.2.3

### Patch Changes

- 9c595302cb: Normalize on winston version ^3.2.1
- dae0bbe522: VaultBuilder.tsx renamed to VaultBuilder in order for module to be correctly loaded.
- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/backend-test-utils@0.1.29
  - @backstage/backend-tasks@0.3.6
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/backend-test-utils@0.1.29-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2

## 0.2.3-next.1

### Patch Changes

- dae0bbe522: VaultBuilder.tsx renamed to VaultBuilder in order for module to be correctly loaded.
- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/backend-test-utils@0.1.29-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.29-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0

## 0.2.2

### Patch Changes

- 3f739be9d9: Minor API signatures cleanup
- 148568b5c2: Switched to using node-fetch instead of cross-fetch as is standard for our backend packages
- 60b85d8ade: Updated dependency `helmet` to `^6.0.0`.

  Please note that these policies are no longer applied by default:

  helmet.contentSecurityPolicy no longer sets block-all-mixed-content directive by default
  helmet.expectCt is no longer set by default. It can, however, be explicitly enabled. It will be removed in Helmet 7.

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/backend-tasks@0.3.5
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1
  - @backstage/backend-test-utils@0.1.28

## 0.2.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/backend-test-utils@0.1.28-next.3
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/backend-tasks@0.3.5-next.1

## 0.2.2-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/backend-test-utils@0.1.28-next.2

## 0.2.2-next.1

### Patch Changes

- 148568b5c2: Switched to using node-fetch instead of cross-fetch as is standard for our backend packages
- 60b85d8ade: Updated dependency `helmet` to `^6.0.0`.

  Please note that these policies are no longer applied by default:

  helmet.contentSecurityPolicy no longer sets block-all-mixed-content directive by default
  helmet.expectCt is no longer set by default. It can, however, be explicitly enabled. It will be removed in Helmet 7.

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/backend-test-utils@0.1.28-next.1

## 0.2.2-next.0

### Patch Changes

- 3f739be9d9: Minor API signatures cleanup
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/backend-test-utils@0.1.28-next.0

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/backend-test-utils@0.1.27
  - @backstage/backend-tasks@0.3.4

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/backend-tasks@0.3.4-next.0
  - @backstage/backend-test-utils@0.1.27-next.0

## 0.2.0

### Minor Changes

- 5ebf2c7023: Throw exceptions instead of swallow them, remove some exported types from the `api-report`, small changes in the API responses & expose the vault `baseUrl` to the frontend as well

### Patch Changes

- 7ee4abdcc9: Added a path notion in addition to secret name to allow to differentiate secrets in sub-paths
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/backend-test-utils@0.1.26
  - @backstage/backend-tasks@0.3.3
  - @backstage/errors@1.1.0

## 0.2.0-next.3

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/backend-test-utils@0.1.26-next.3
  - @backstage/backend-tasks@0.3.3-next.3

## 0.2.0-next.2

### Patch Changes

- 7ee4abdcc9: Added a path notion in addition to secret name to allow to differentiate secrets in sub-paths
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/backend-tasks@0.3.3-next.2
  - @backstage/backend-test-utils@0.1.26-next.2

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/backend-tasks@0.3.3-next.1
  - @backstage/backend-test-utils@0.1.26-next.1

## 0.2.0-next.0

### Minor Changes

- 5ebf2c7023: Throw exceptions instead of swallow them, remove some exported types from the `api-report`, small changes in the API responses & expose the vault `baseUrl` to the frontend as well

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/backend-tasks@0.3.3-next.0
  - @backstage/backend-test-utils@0.1.26-next.0

## 0.1.0

### Minor Changes

- 7c310a5bc2: First implementation for the backend vault plugin. For more information refer to its `README.md`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2
  - @backstage/backend-common@0.14.0
  - @backstage/backend-test-utils@0.1.25
