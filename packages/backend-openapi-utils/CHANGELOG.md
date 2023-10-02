# @backstage/backend-openapi-utils

## 0.0.4

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.2

## 0.0.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.2-next.0

## 0.0.3

### Patch Changes

- ebeb77586975: Add a new `createRouter` method for generating an `express` router that validates against your spec. Also fixes a bug with the query parameters type resolution.
- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/errors@1.2.1

## 0.0.3-next.1

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/errors@1.2.1

## 0.0.3-next.0

### Patch Changes

- ebeb77586975: Add a new `createRouter` method for generating an `express` router that validates against your spec. Also fixes a bug with the query parameters type resolution.
- Updated dependencies
  - @backstage/errors@1.2.1

## 0.0.2

### Patch Changes

- fe16bd39e83: Use permalinks for links including a line number reference
- 27956d78671: Adjusted README accordingly after the generated output now has a `.generated.ts` extension
- 021cfbb5152: Corrected resolution of parameter nested schema to use central schemas.
- 799c33047ed: Updated README to reflect changes in `@backstage/repo-tools`.

## 0.0.2-next.1

### Patch Changes

- fe16bd39e83: Use permalinks for links including a line number reference
- 021cfbb5152: Corrected resolution of parameter nested schema to use central schemas.

## 0.0.2-next.0

### Patch Changes

- 27956d78671: Adjusted README accordingly after the generated output now has a `.generated.ts` extension

## 0.0.1

### Patch Changes

- 62fe726fdc5: New plugin! Primary focus is to support types on `Router`s in backend packages. Developers can use the `ApiRouter` from this package in their packages to support a typed experience based on their OpenAPI specs. The `ApiRouter` supports request bodies, response bodies, query parameters and path parameters, as well as full path-based context of the above. This means no more guessing on an endpoint like `req.post('/not-my-route', (req, res)=>{res.send(req.body.badparam)})`. Typescript would catch `/not-my-route`, `req.body.badparam`, `res.send(req.body.badparam)`.

## 0.0.1-next.0

### Patch Changes

- 62fe726fdc5: New plugin! Primary focus is to support types on `Router`s in backend packages. Developers can use the `ApiRouter` from this package in their packages to support a typed experience based on their OpenAPI specs. The `ApiRouter` supports request bodies, response bodies, query parameters and path parameters, as well as full path-based context of the above. This means no more guessing on an endpoint like `req.post('/not-my-route', (req, res)=>{res.send(req.body.badparam)})`. Typescript would catch `/not-my-route`, `req.body.badparam`, `res.send(req.body.badparam)`.
