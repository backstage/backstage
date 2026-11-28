---
'@backstage/cli': minor
---

The ESLint configuration created by `@backstage/cli/config/eslint-factory` now loads its shared configs, parser and plugins from the dependencies of `@backstage/cli`, so they no longer need to be hoisted to the root of the repository. ESLint can now load the configuration with strict `node_modules` layouts, such as pnpm without public hoisting, including when it runs outside of `backstage-cli`, for example in an editor.

**BREAKING**: ESLint now resolves each plugin from the location of every config that declares it, and only falls back to the previous location if the plugin isn't found there. If a config of your own, such as the root `.eslintrc.js`, declares a plugin that the factory also uses, for example `jest` or `react`, and it resolves to a different copy of the plugin than the one `@backstage/cli` uses, linting fails with `Plugin "jest" was conflicted between …`, or with `ESLint couldn't determine the plugin "jest" uniquely` when you run `eslint` directly. To fix it, make sure your repository has a single copy of the plugin, for example by depending on the same version as `@backstage/cli` and removing duplicates from your lockfile, or remove the plugin from your config.
