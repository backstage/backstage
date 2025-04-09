---
'@backstage/cli': minor
---

**BREAKING**: The new app build based on [Rspack](https://rspack.dev/) is now the default, and the `EXPERIMENTAL_RSPACK` flag has been removed. To revert to the old behavior, set the `LEGACY_WEBPACK_BUILD` environment flag and install the following optional dependencies:

```json
{
  "dependencies": {
    "@module-federation/enhanced": "^0.9.0",
    "@pmmmwh/react-refresh-webpack-plugin": "^0.5.7",
    "esbuild-loader": "^4.0.0",
    "mini-css-extract-plugin": "^2.4.2",
    "terser-webpack-plugin": "^5.1.3",
    "webpack": "^5.94.0",
    "webpack-dev-server": "^5.0.0"
  }
}
```

If you do encounter a blocking issue that forces you to use the old WebPack build, please [open an issue](https://github.com/backstage/backstage/issues) explaining the problem. The WebPack build will be removed in a future release.
