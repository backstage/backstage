# @backstage/plugin-fossa

## 0.2.0

### Minor Changes

- 5ac9df899: Port FOSSA plugin to new extension model.

  If you are using the FOSSA plugin adjust the plugin import from `plugin` to
  `fossaPlugin` and replace `<FossaCard entity={...} ...>` with `<EntityFossaCard />`.

### Patch Changes

- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [54c7d02f7]
- Updated dependencies [11cb5ef94]
  - @backstage/core@0.6.0
  - @backstage/plugin-catalog-react@0.0.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.1.2

### Patch Changes

- 9f618bf16: Request a sorted response list to select the project with the correct title. The FOSSA API
  matches title searches with "starts with" so previously it used the response for `my-project-part`
  if you searched for `my-project`.
- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [a187b8ad0]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0

## 0.1.1

### Patch Changes

- 7afdfef98: Bump dependency versions of @backstage/core, cli and test-utils
- Updated dependencies [a08c32ced]
  - @backstage/core@0.4.3
