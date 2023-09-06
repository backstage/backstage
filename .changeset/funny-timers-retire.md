---
'@backstage/cli': patch
---

Added a new `repo fix` command that fixes auto-fixable problems in all packages. Initially the command fixes package export declarations, as well as marks all non-bundled frontend packages as side-effect free. Marking packages as free of side-effects can drastically reduce the Webpack bundle size.
