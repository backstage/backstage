---
'@backstage/core-components': minor
---

Made the `to` prop of `Button` and `Link` more strict, only supporting plain strings. It used to be the case that this prop was unexpectedly too liberal, making it look like we supported the complex `react-router-dom` object form of the parameter as well, which led to unexpected results at runtime.
