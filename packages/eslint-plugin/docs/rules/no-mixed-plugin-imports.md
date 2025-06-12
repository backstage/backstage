# @backstage/no-mixed-plugin-imports

Disallow mixed imports between backstage plugins.

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
