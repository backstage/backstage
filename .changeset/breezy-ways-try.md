---
'@backstage/cli': minor
---

Switch from `ts-jest` to `@sucrase/jest-plugin`, improving performance and aligning transpilation with bundling.

In order to switch back to `ts-jest`, install `ts-jest@^26.4.3` as a dependency in the root of your repo and add the following in the root `package.json`:

```json
"jest": {
  "globals": {
    "ts-jest": {
      "isolatedModules": true
    }
  },
  "transform": {
    "\\.esm\\.js$": "@backstage/cli/config/jestEsmTransform.js",
    "\\.(js|jsx|ts|tsx)$": "ts-jest",
    "\\.(bmp|gif|jpg|jpeg|png|frag|xml|svg)$": "@backstage/cli/config/jestFileTransform.js",
    "\\.(yaml)$": "yaml-jest"
  }
}
```

Note that this will override the default jest transforms included with the `@backstage/cli`.

It is possible that some test code needs a small migration as a result of this change, which stems from a difference in how `sucrase` and `ts-jest` transform module re-exports.

Consider the following code:

```ts
import * as utils from './utils';

jest.spyOn(utils, 'myUtility').mockReturnValue(3);
```

If the `./utils` import for example refers to an index file that in turn re-exports from `./utils/myUtility`, you would have to change the code to the following to work around the fact that the exported object from `./utils` ends up not having configurable properties, thus breaking `jest.spyOn`.

```ts
import * as utils from './utils/myUtility';

jest.spyOn(utils, 'myUtility').mockReturnValue(3);
```
