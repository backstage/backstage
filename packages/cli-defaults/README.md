# @backstage/cli-defaults

The default set of CLI modules for the Backstage CLI. Install this package as a
direct dependency in the root of your repository to provide all standard CLI
commands without listing each module individually:

```sh
yarn add --dev @backstage/cli-defaults
```

## Included Modules

| Module                                                             | Description                              |
| :----------------------------------------------------------------- | :--------------------------------------- |
| [`@backstage/cli-module-actions`](../cli-module-actions)           | Action discovery commands                |
| [`@backstage/cli-module-auth`](../cli-module-auth)                 | Authentication commands                  |
| [`@backstage/cli-module-build`](../cli-module-build)               | Build, start, and packaging commands     |
| [`@backstage/cli-module-config`](../cli-module-config)             | Configuration inspection commands        |
| [`@backstage/cli-module-github`](../cli-module-github)             | GitHub App creation                      |
| [`@backstage/cli-module-info`](../cli-module-info)                 | Environment and dependency info          |
| [`@backstage/cli-module-lint`](../cli-module-lint)                 | Linting commands                         |
| [`@backstage/cli-module-maintenance`](../cli-module-maintenance)   | Repository maintenance commands          |
| [`@backstage/cli-module-migrate`](../cli-module-migrate)           | Migration and version management         |
| [`@backstage/cli-module-new`](../cli-module-new)                   | Scaffolding for new plugins and packages |
| [`@backstage/cli-module-test-jest`](../cli-module-test-jest)       | Jest-based testing commands              |
| [`@backstage/cli-module-translations`](../cli-module-translations) | Translation management commands          |

For fine-grained control over which CLI commands are available, you can install
individual modules instead. You can also install an individual module alongside
this package. If any command overlaps, the individually installed module
replaces the entire conflicting module from this aggregate.

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
