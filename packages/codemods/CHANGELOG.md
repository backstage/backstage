# @backstage/codemods

## 0.1.17

### Patch Changes

- 7dee4db0b0: build(deps): bump `jscodeshift` from 0.12.0 to 0.13.0
- 903dbdeb7d: Added an `extension-names` codemod, which adds a `name` key to all extensions
  provided by plugins. Extension names are used to provide richer context to
  events captured by the new Analytics API, and may also appear in debug output
  and other situations.

  To apply this codemod, run `npx @backstage/codemods apply extension-names` in
  the root of your Backstage monorepo.

- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10
  - @backstage/core-app-api@0.1.16
  - @backstage/cli-common@0.1.4

## 0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.1.15
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0

## 0.1.15

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/core-app-api@0.1.14

## 0.1.14

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/core-app-api@0.1.13
  - @backstage/core-plugin-api@0.1.8

## 0.1.13

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.4.1
  - @backstage/cli-common@0.1.3
  - @backstage/core-app-api@0.1.12
  - @backstage/core-plugin-api@0.1.7

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.4.0
  - @backstage/core-app-api@0.1.11

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.1.10
  - @backstage/core-components@0.3.3

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.1.9
  - @backstage/core-components@0.3.2

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.1.8
  - @backstage/core-components@0.3.1
  - @backstage/core-plugin-api@0.1.6

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/core-plugin-api@0.1.5
  - @backstage/core-app-api@0.1.7

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/core-app-api@0.1.6
  - @backstage/core-plugin-api@0.1.4

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.1.6
  - @backstage/core-app-api@0.1.5

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.1.4
  - @backstage/core-components@0.1.4
  - @backstage/cli-common@0.1.2

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.1.3
  - @backstage/core-plugin-api@0.1.3

## 0.1.2

Fixed a publish issue, making this package available to the public.

## 0.1.1

### Patch Changes

- 59752e103: Fix execution of `jscodeshift` on windows.
- Updated dependencies
  - @backstage/core-components@0.1.3

## 0.1.0

### Patch Changes

- Updated dependencies [9bca2a252]
- Updated dependencies [e47336ea4]
- Updated dependencies [75b8537ce]
- Updated dependencies [da8cba44f]
- Updated dependencies [da8cba44f]
- Updated dependencies [9bca2a252]
  - @backstage/core-app-api@0.1.2
  - @backstage/core-components@0.1.2
  - @backstage/core-plugin-api@0.1.2
