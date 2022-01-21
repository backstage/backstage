---
'@backstage/cli': patch
---

Upgraded `webpack`, `webpack-dev-server`,`fork-ts-checker-webpack-plugin`, `react-dev-utils`, and `react-hot-loader`. Since `ForkTsCheckerWebpackPlugin` no longer runs ESLint, we now include the `ESLintPlugin` from `eslint-webpack-plugin` if the `--check` flag is passed.
