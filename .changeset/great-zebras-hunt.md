---
'@backstage/cli': patch
---

The app build process now outputs an additional `index.html.tmpl` file. This is an non-templated version of the `index.html` file, which can be used to delay templating until runtime.
