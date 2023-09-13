---
id: overriding-webpack-config
title: Overriding webpack config
description: Guide on how to override the default webpack configuration
---

By default, Backstage configures [webpack](https://webpack.js.org/) with sane defaults.
In some cases, application developers might want to change this configuration and
add for example new modules or plugins to the system.

For this, it's possible to override the default configuration by providing
`webpack.config.js` file to the root of the **packages/app/** and **packages/backend**
directories.

The configuration file must export default function that returns the overriding configuration.
The original configuration is passed to the function as a parameter, see the example below.

Example of configuration:

```js
/**
 * Webpack configuration override
 * @param config The original configuration from Backstage
 * @returns webpack.Configuration
 */
module.exports = config => {
  return {
    ...config,
    profile: config.mode === 'development' ? true : false,
  };
};
```

See available configuration options from [webpack documentation](https://webpack.js.org/configuration/).

Default configuration is available in `/packages/cli/src/lib/bundler/config.ts`.
