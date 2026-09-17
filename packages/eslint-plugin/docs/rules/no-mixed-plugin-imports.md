# @backstage/no-mixed-plugin-imports

This rule ensures that imports between Backstage plugins are consistent with their intended usage.

The rule checks the `backstage.role` field in the `package.json` of both the importing and target packages to determine if they are compatible.

Plugin roles include:

- `frontend-plugin` (or `frontend` for short)
- `backend-plugin` (or `backend` for short)
- `web-library` (or `react` for short)
- `node-library` (or `node` for short)
- `common-library` (or `common` for short)

Prohibited imports include:

- A `frontend` plugin importing directly from another `frontend`, `backend`, or `node` package. Instead, it should import from the corresponding `react` or `common` package.
  - With an exception with the new frontend system where frontend plugins with the same plugin id are allowed to import from each other.
- A `backend` plugin importing directly from another `backend`, `frontend`, or `react` package. Instead, it should import from the corresponding `node` or `common` package.
- A `react` package importing from `frontend`, `backend`, or `node` packages.
- A `node` package importing from `frontend`, `backend`, or `react` packages
- A `common` package importing directly from any other plugin package.

## Usage

Add the rules as follows, it has no options:

```js
"@backstage/no-mixed-plugin-imports": ["error"]
```

## Rule Details

Given the following two target packages:

```json
{
  "name": "@backstage/plugin-foo",
  "backstage": {
    "role": "frontend-plugin"
  }
}
```

```json
{
  "name": "@backstage/plugin-bar",
  "backstage": {
    "role": "frontend-plugin"
  }
}
```

### Fail

```ts
import { FooCard } from '@backstage/plugin-foo';
```

### Pass

```ts
import { FooCard } from '@backstage/plugin-foo-react';
```

## Options

You can ignore specific target packages or files by adding them to the options in the `.eslintrc.js` file:

```js
{
  rules: {
    '@backstage/no-mixed-plugin-imports': [
      'error',
      {
        excludedTargetPackages: [
          '@backstage/plugin-foo',
        ],
        excludedFiles: [
          '**/*.{test,spec}.[jt]s?(x)'
        ],
      }
    ]
  }
}
```
