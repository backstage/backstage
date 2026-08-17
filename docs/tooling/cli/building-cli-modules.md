---
id: building-cli-modules
title: Custom CLI Modules
description: Guide to building custom CLI modules that extend the Backstage CLI.
---

You can extend the Backstage CLI with custom commands by creating your own CLI
modules. A CLI module is a package that registers one or more commands using the
`createCliModule` API from `@backstage/cli-node`. Once installed as a dependency
in your project, the CLI discovers and loads it automatically.

## Scaffolding a new module

To scaffold a module, use the built-in template:

```bash
yarn new
```

Select the `cli-module` template from the interactive menu. This creates a new
package with the correct structure, including a sample command, a standalone bin
script, and all the required configuration.

## Module structure

A CLI module package has the following structure:

```text
packages/cli-module-example/
  bin/
    backstage-cli-module-example    # Standalone bin script
  src/
    commands/
      example.ts                    # Command implementation
    index.ts                        # Module definition
  package.json
```

### package.json

The `package.json` must set `backstage.role` to `"cli-module"`. This is how the
CLI identifies the package as a module during dependency scanning.

```json title="package.json"
{
  "name": "@mycompany/cli-module-example",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "publishConfig": {
    "access": "public",
    "main": "dist/index.cjs.js",
    "types": "dist/index.d.ts"
  },
  "backstage": {
    "role": "cli-module"
  },
  "bin": "bin/backstage-cli-module-example",
  "files": ["dist", "bin"],
  "dependencies": {
    "@backstage/cli-common": "...",
    "@backstage/cli-node": "...",
    "cleye": "..."
  },
  "devDependencies": {
    "@backstage/cli": "..."
  }
}
```

### Module definition

The module entry point uses `createCliModule` to register commands:

```ts title="src/index.ts"
import { createCliModule } from '@backstage/cli-node';
import packageJson from '../package.json';

export default createCliModule({
  packageJson,
  init: async reg => {
    reg.addCommand({
      path: ['example'],
      description: 'An example command',
      execute: { loader: () => import('./commands/example') },
    });
  },
});
```

## The `createCliModule` API

The `createCliModule` function accepts an options object with two fields:

- **`packageJson`** — An object with at least a `name` field, typically the
  imported `package.json`. The name is used in error messages when command
  conflicts occur.
- **`init`** — An async callback that receives a registry object. Use the
  registry's `addCommand` method to register commands.

The `init` callback runs when the module is loaded, not when a command is
executed. Keep it lightweight and use the deferred loader pattern for commands
with heavy dependencies.

## Defining commands

Each command is defined by a `CliCommand` object passed to `reg.addCommand`:

```ts
reg.addCommand({
  path: ['my-tool', 'run'],
  description: 'Run the tool',
  execute: async ({ args, info }) => {
    // Command implementation
  },
});
```

### Command path

The `path` array defines how the command is invoked. Each element becomes a
level in the command hierarchy:

- `['info']` registers `backstage-cli info`
- `['repo', 'test']` registers `backstage-cli repo test`
- `['actions', 'sources', 'add']` registers `backstage-cli actions sources add`

Intermediate nodes in the path are created automatically and appear as command
groups in the help output.

### Description

A short string shown in the help output next to the command name.

### Deprecated and experimental flags

Commands can be marked with `deprecated: true` or `experimental: true`. These
commands are hidden from the `--help` output but can still be used.

### Execute function

The `execute` field supports two patterns:

**Direct execution** — an inline async function:

```ts
reg.addCommand({
  path: ['greet'],
  description: 'Print a greeting',
  execute: async ({ args, info }) => {
    console.log('Hello!');
  },
});
```

**Deferred loading** — a loader that dynamically imports the command
implementation. This is the recommended pattern because it avoids loading heavy
dependencies until the command is actually invoked:

```ts
reg.addCommand({
  path: ['greet'],
  description: 'Print a greeting',
  execute: { loader: () => import('./commands/greet') },
});
```

When using the deferred loader pattern, the command file must export the execute
function as its default export:

```ts title="src/commands/greet.ts"
import type { CliCommandContext } from '@backstage/cli-node';

export default async ({ args, info }: CliCommandContext) => {
  console.log('Hello!');
};
```

## Command context

The execute function receives a `CliCommandContext` with two fields:

- **`args`** — An array of the remaining command-line arguments after the
  command path has been resolved. For example, if the user runs
  `backstage-cli greet --name World`, the `args` array would be
  `['--name', 'World']`.
- **`info`** — An object with `usage` (the full command path as shown in help,
  for example `"backstage-cli greet"`) and `name` (the command name, for
  example `"greet"`).

## Parsing flags

Commands typically use [`cleye`](https://github.com/privatenumber/cleye) to
parse flags from the `args` array. This is the same library used by all built-in
CLI modules:

```ts title="src/commands/greet.ts"
import { cli } from 'cleye';
import type { CliCommandContext } from '@backstage/cli-node';

export default async ({ args, info }: CliCommandContext) => {
  const { flags } = cli(
    {
      name: info.usage,
      flags: {
        name: {
          type: String,
          description: 'Name to greet',
          default: 'World',
        },
        loud: {
          type: Boolean,
          description: 'Shout the greeting',
        },
      },
    },
    undefined,
    args,
  );

  const greeting = `Hello, ${flags.name}!`;
  console.log(flags.loud ? greeting.toUpperCase() : greeting);
};
```

## Standalone execution

Each CLI module can also run as a standalone program, without the full
`@backstage/cli`. This is useful for distributing a module independently. The
scaffolded template includes a bin script that does this:

```js title="bin/backstage-cli-module-example"
#!/usr/bin/env node
const path = require('node:path');

/* eslint-disable-next-line no-restricted-syntax */
const isLocal = require('node:fs').existsSync(
  path.resolve(__dirname, '../src'),
);

if (isLocal) {
  require('@backstage/cli-node/config/nodeTransform.cjs');
}

const { runCli } = require('@backstage/cli-node');
const cliModule = require(isLocal ? '../src/index' : '..').default;
const pkg = require('../package.json');
runCli({ modules: [cliModule], name: pkg.name, version: pkg.version });
```

The `isLocal` check detects whether a `src/` directory exists next to the bin
script. When running from source during development, it registers a Node.js
transform so TypeScript files can be loaded directly. When running from a
published package, it loads the compiled output instead.

## Installing your module

Once your module is published or available as a workspace package, add it as a
dependency in your project root's `package.json`:

```json title="package.json"
{
  "devDependencies": {
    "@backstage/cli": "...",
    "@mycompany/cli-module-example": "..."
  }
}
```

The CLI discovers it automatically on the next run. Your custom commands appear
in the `--help` output alongside the default commands.

If your module registers a command path that conflicts with a default module from
`@backstage/cli-defaults`, your module takes precedence and the conflicting
default module is silently skipped. See [CLI Modules](./05-modules.md) for more
details on conflict resolution.
