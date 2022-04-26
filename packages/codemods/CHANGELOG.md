# @backstage/codemods

## 0.1.38-next.0

### Patch Changes

- 344ea56acc: Bump `commander` to version 9.1.0

## 0.1.37

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16

## 0.1.37-next.0

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16

## 0.1.36

### Patch Changes

- 224441d0f9: Inlined the table of symbols used by the `core-imports` codemod so that future updates to the core packages don't break the codemod. An entry for has also been added to direct imports of `createApp` to `@backstage/app-defaults`.

## 0.1.35

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.1

## 0.1.35-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.1-next.0

## 0.1.35

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.8

## 0.1.34

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/core-app-api@0.5.3
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/cli-common@0.1.7

## 0.1.33

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8

## 0.1.33-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8-next.0

## 0.1.32

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7
  - @backstage/core-app-api@0.5.2

## 0.1.32-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.1
  - @backstage/core-app-api@0.5.2-next.0

## 0.1.32-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.0

## 0.1.31

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.6
  - @backstage/core-app-api@0.5.1

## 0.1.30

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.5
  - @backstage/core-plugin-api@0.6.0
  - @backstage/core-app-api@0.5.0

## 0.1.30-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/core-app-api@0.5.0-next.0

## 0.1.29

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
  - @backstage/core-app-api@0.4.0

## 0.1.28

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.4.1
  - @backstage/core-app-api@0.3.1
  - @backstage/core-components@0.8.3

## 0.1.27

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.3.0
  - @backstage/core-plugin-api@0.4.0
  - @backstage/core-components@0.8.2

## 0.1.26

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.2.1
  - @backstage/core-plugin-api@0.3.1
  - @backstage/core-components@0.8.1

## 0.1.25

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/core-app-api@0.2.0

## 0.1.24

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.7.6
  - @backstage/core-plugin-api@0.2.2
  - @backstage/core-app-api@0.1.24

## 0.1.23

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.1.23
  - @backstage/core-plugin-api@0.2.1
  - @backstage/core-components@0.7.5

## 0.1.22

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.6
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0
  - @backstage/core-app-api@0.1.21

## 0.1.21

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.7.3
  - @backstage/core-plugin-api@0.1.13
  - @backstage/core-app-api@0.1.20

## 0.1.20

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.5
  - @backstage/core-components@0.7.2
  - @backstage/core-app-api@0.1.19
  - @backstage/core-plugin-api@0.1.12

## 0.1.19

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.7.1
  - @backstage/core-app-api@0.1.18
  - @backstage/core-plugin-api@0.1.11

## 0.1.18

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.1.17
  - @backstage/core-components@0.7.0

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
