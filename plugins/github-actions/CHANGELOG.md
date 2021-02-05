# @backstage/plugin-github-actions

## 0.3.1

### Patch Changes

- 019fe39a0: Switch dependency from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
- Updated dependencies [12ece98cd]
- Updated dependencies [c4abcdb60]
- Updated dependencies [d82246867]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [064c513e1]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [3149bfe63]
- Updated dependencies [54c7d02f7]
- Updated dependencies [2e62aea6f]
- Updated dependencies [11cb5ef94]
  - @backstage/core@0.6.0
  - @backstage/integration@0.3.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.3.0

### Minor Changes

- 46bba09ea: Support GHE

### Patch Changes

- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [0b135e7e0]
- Updated dependencies [593632f07]
- Updated dependencies [33846acfc]
- Updated dependencies [fa8ba330a]
- Updated dependencies [a187b8ad0]
- Updated dependencies [ed6baab66]
- Updated dependencies [f04db53d7]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/integration@0.3.0
  - @backstage/plugin-catalog@0.2.12

## 0.2.7

### Patch Changes

- 94fdf4955: Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
- a6f9dca0d: Remove dependency on `@backstage/core-api`. No plugin should ever depend on that package; it's an internal concern whose important bits are re-exported by `@backstage/core` which is the public facing dependency to use.
- Updated dependencies [f3b064e1c]
- Updated dependencies [c00488983]
- Updated dependencies [265a7ab30]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/catalog-model@0.6.1
  - @backstage/plugin-catalog@0.2.11
  - @backstage/core@0.4.4

## 0.2.6

### Patch Changes

- 19554f6d6: Added GitHub Actions for Create React App, and allow better imports of files inside a module when they're exposed using `files` in `package.json`
- Updated dependencies [d681db2b5]
- Updated dependencies [1dc445e89]
- Updated dependencies [342270e4d]
- Updated dependencies [1dc445e89]
  - @backstage/core-api@0.2.7
  - @backstage/core@0.4.2
  - @backstage/plugin-catalog@0.2.8

## 0.2.5

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [7dd2ef7d1]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/core@0.4.1
  - @backstage/core-api@0.2.6
  - @backstage/plugin-catalog@0.2.7

## 0.2.4

### Patch Changes

- Updated dependencies [b6557c098]
- Updated dependencies [2527628e1]
- Updated dependencies [6011b7d3e]
- Updated dependencies [1c69d4716]
- Updated dependencies [d8d5a17da]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core-api@0.2.5
  - @backstage/core@0.4.0
  - @backstage/plugin-catalog@0.2.6
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2

## 0.2.3

### Patch Changes

- Updated dependencies [b4488ddb0]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
- Updated dependencies [ebf37bbae]
  - @backstage/core-api@0.2.4
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-catalog@0.2.5

## 0.2.2

### Patch Changes

- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [1185919f3]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-catalog@0.2.3

## 0.2.1

### Patch Changes

- Updated dependencies [c5bab94ab]
- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
- Updated dependencies [2d0bd1be7]
  - @backstage/core-api@0.2.1
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1
  - @backstage/plugin-catalog@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI
- d67c529ab: Adds a widget to show recent git workflow runs to the GitHub actions plugin. The default setting is the last 5 runs across all branches but both branch and the number of runs are configurable.
- 6d97d2d6f: The InfoCard variant `'height100'` is deprecated. Use variant `'gridItem'` instead.

  When the InfoCard is displayed as a grid item within a grid, you may want items to have the same height for all items.
  Set to the `'gridItem'` variant to display the InfoCard with full height suitable for Grid:
  `<InfoCard variant="gridItem">...</InfoCard>`

  Changed the InfoCards in '@backstage/plugin-github-actions', '@backstage/plugin-jenkins', '@backstage/plugin-lighthouse'
  to pass an optional variant to the corresponding card of the plugin.

  As a result the overview content of the EntityPage shows cards with full height suitable for Grid.

### Patch Changes

- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [3a4236570]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [cbbd271c4]
- Updated dependencies [482b6313d]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [368fd8243]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a768a07fb]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [5adfc005e]
- Updated dependencies [f0aa01bcc]
- Updated dependencies [0aecfded0]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [8b9c8196f]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [60d40892c]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [2ebcfac8d]
- Updated dependencies [fa56f4615]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [b3d57961c]
- Updated dependencies [0b956f21b]
- Updated dependencies [26e69ab1a]
- Updated dependencies [97c2cb19b]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [cbab5bbf8]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/plugin-catalog@0.2.0
  - @backstage/core-api@0.2.0
  - @backstage/core@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/theme@0.2.0
