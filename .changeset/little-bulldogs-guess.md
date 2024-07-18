---
'@backstage/cli': patch
---

Add ability to force use of the development versions of `react` and `react-dom`
to allow for detailed error messages and use of fast-refresh. Note that builds
with the development versions of `react` and `react-dom` should not be
deployed in production.

This feature can be used by setting the `FORCE_REACT_DEVELOPMENT` environment
variable to `true`:

```bash
EXPERIMENTAL_MODULE_FEDERATION=true \
FORCE_REACT_DEVELOPMENT=true \
yarn build:all
```
