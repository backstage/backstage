---
'@backstage/cli': minor
---

The CLI now automatically discovers CLI modules from the project root's `dependencies` and `devDependencies`. Any installed package with the `cli-module` Backstage role will be loaded automatically without needing to be hardcoded in the CLI itself.

If no CLI modules are found in the project dependencies, the CLI falls back to the built-in set of modules and prints a deprecation warning. This fallback will be removed in a future release. To prepare for this, add the following CLI modules as `devDependencies` in your root `package.json`:

```json
{
  "devDependencies": {
    "@backstage/cli-module-auth": "backstage:^",
    "@backstage/cli-module-build": "backstage:^",
    "@backstage/cli-module-config": "backstage:^",
    "@backstage/cli-module-create-github-app": "backstage:^",
    "@backstage/cli-module-info": "backstage:^",
    "@backstage/cli-module-lint": "backstage:^",
    "@backstage/cli-module-maintenance": "backstage:^",
    "@backstage/cli-module-migrate": "backstage:^",
    "@backstage/cli-module-new": "backstage:^",
    "@backstage/cli-module-test-jest": "backstage:^",
    "@backstage/cli-module-translations": "backstage:^"
  }
}
```

If you are not using the Backstage Yarn plugin, run the following instead:

```sh
yarn workspace root add --dev @backstage/cli-module-auth @backstage/cli-module-build @backstage/cli-module-config @backstage/cli-module-create-github-app @backstage/cli-module-info @backstage/cli-module-lint @backstage/cli-module-maintenance @backstage/cli-module-migrate @backstage/cli-module-new @backstage/cli-module-test-jest @backstage/cli-module-translations
```
