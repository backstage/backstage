# @backstage/plugin-fossa

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
