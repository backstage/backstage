---
'@backstage/cli': patch
---

Change webpack caching config param to `contenthash` for cli bundler. This fixes an issue with webpack sometimes generating same hash name output files even though the content of a file was different. See more at [https://webpack.js.org/guides/caching/](https://webpack.js.org/guides/caching/).
