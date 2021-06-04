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
