---
'@backstage/cli': patch
---

Ignore transforming only on `react-use/lib`, not whole `react-use` in jest.

** POTENTIAL BREAKAGE **
If your tests fail, please change to use path import from `react-use/esm/`. It is also recommended to migrate from `react-user/lib` imports to `react-use/esm`
