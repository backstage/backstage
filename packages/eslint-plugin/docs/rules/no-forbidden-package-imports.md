# @backstage/no-forbidden-package-imports

Disallow internal monorepo imports from package subpaths that are not exported.

## Usage

Add the rules as follows, it has no options:

```js
"@backstage/no-forbidden-package-imports": ["error"]
```

## Rule Details

Given the following two target packages:

```json
{
  "name": "@backstage/plugin-foo",
  "files": ["dist", "type-utils"]
}
```

```json
{
  "name": "@backstage/plugin-bar",
  "exports": {
    ".": "./src/index.ts",
    "./testUtils": "./src/testUtils/index.ts",
    "./package.json": "./package.json"
  }
}
```

### Fail

```ts
import { FooCard } from '@backstage/plugin-foo/src/components';
import { BarCard } from '@backstage/plugin-bar/src/components';
```

### Pass

```ts
import { FooCard } from '@backstage/plugin-foo';
import { FooType } from '@backstage/plugin-foo/type-utils';
import fooPkg from '@backstage/plugin-foo/package.json';

import { BarCard } from '@backstage/plugin-bar';
import { renderBarCardExtension } from '@backstage/plugin-bar/testUtils';
import barPkg from '@backstage/plugin-bar/package.json';
```
