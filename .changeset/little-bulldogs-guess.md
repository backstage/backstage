---
'@backstage/cli': patch
---

Add ability to force use of the development versions of `react` and `react-dom`
by setting the `FORCE_REACT_DEVELOPMENT` environment variable to `true` when
building, for example by using a command like `FORCE_REACT_DEVELOPMENT=true yarn
build:all`.
