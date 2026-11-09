# @backstage/filter-predicates

## 0.2.0

### Minor Changes

- 11f608b: **BREAKING**: The `FilterPredicate` type, the zod schemas and `parseFilterPredicate` now only accept objects at the root of a predicate. Primitive values such as `"component"` or `true` were previously accepted at the root, but no API that accepts filter predicates could match them in a meaningful way. Primitive values are still allowed as values to match against properties, and as the operand of `$contains` to match arrays of primitive values, for example `{ "metadata.tags": { "$contains": "java" } }`.

  A new `AnyFilterPredicate` type describes predicates that may also be primitive values at the root, which is equivalent to the previous `FilterPredicate` type. It is used for the operand of `$contains`, and is accepted by `evaluateFilterPredicate`.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0

## 0.1.5

### Patch Changes

- 736d84e: Use locale-insensitive Unicode casing for consistent string handling across environments.
- 603e704: The JSON Schema exported for filter predicates can now be compiled by validators built on RE2 (for example Go's `regexp`, used by Amazon Bedrock AgentCore Gateway), which previously rejected the predicate key pattern and failed every call to tools such as `query-catalog-entities`. Accepted keys are unchanged, except that a key whose first character is U+2028 or U+2029 is no longer rejected.
- 6dcb08a: Reduced the frontend bundle size by letting bundlers tree-shake zod, which previously pulled every zod locale into the bundle. Takes effect on zod 4.5.0 and newer.
- Updated dependencies
  - @backstage/config@1.3.9

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.9-next.0

## 0.1.5-next.0

### Patch Changes

- 6dcb08a: Reduced the frontend bundle size by letting bundlers tree-shake zod, which previously pulled every zod locale into the bundle. Takes effect on zod 4.5.0 and newer.

## 0.1.4

### Patch Changes

- 28c1c1c: Synced zod-validation-error versions between packages

## 0.1.4-next.0

### Patch Changes

- 28c1c1c: Synced zod-validation-error versions between packages

## 0.1.3

### Patch Changes

- 691da8d: Filter predicates that mix operator keys (`$all`, `$any`, `$not`) with other keys are now rejected. Previously, a predicate like `{ kind: 'API', $not: { 'spec.type': 'dataset' } }` would silently drop the `kind` check. The correct form wraps conditions in `$all`.
- Updated dependencies
  - @backstage/errors@1.3.1
  - @backstage/config@1.3.8

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/types@1.2.2

## 0.1.2

### Patch Changes

- 8923d6d: Added `createZodV4FilterPredicateSchema` as a zod v4 counterpart to `createZodV3FilterPredicateSchema`.
- Updated dependencies
  - @backstage/errors@1.3.0
  - @backstage/config@1.3.7

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/config@1.3.7-next.0

## 0.1.1

### Patch Changes

- a49a40d: Updated dependency `zod` to `^3.25.76 || ^4.0.0` & migrated to `/v3` or `/v4` imports.

## 0.1.0

### Minor Changes

- 7feb83b: Introduced package, basically as the extracted predicate types from `@backstage/plugin-catalog-react/alpha`

## 0.1.0-next.0

### Minor Changes

- 7feb83b: Introduced package, basically as the extracted predicate types from `@backstage/plugin-catalog-react/alpha`
