---
'@backstage/cli': patch
---

The app build process now outputs an additional `index.html.tmpl` file. This is an non-templated version of the `index.html` file, which can be used to delay templating until runtime.

The new `index.html.tmpl` file also sets a `backstage-public-path` meta tag to be templated at runtime. The meta tag is in turn picked up by the new `@backstage/cli/config/webpack-public-path.js` entry point script, which uses it to set the runtime public path of the Webpack bundle.
