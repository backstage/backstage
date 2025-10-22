---
id: 001-first-steps
sidebar_label: 001 - Scaffolding the plugin
title: How to scaffold a new plugin?
---

# Scaffolding a new plugin

<!-- Talk through how to run the `backstage-cli create` command as well as what the output it creates is. This should touch on why we install this into `packages/backend`. -->

## `yarn new`

A new, bare-bones backend plugin package can be created by issuing the following
command in your Backstage repository's root directory and selecting `backend-plugin`:

```sh
yarn new
```

You will be asked to supply a name for the plugin. This is an identifier that
will be part of the NPM package name, so make it short and containing only
lowercase characters separated by dashes, for our example, you should provide `todo`. For plugins you may write in the future, this should be an easy to remember indicator of what this plugins does, like if it's a
package that adds an integration with a system named Carmen, you would want to name it `carmen`.

This will create a new NPM package with a package name something like `@internal/plugin-carmen-backend`, depending on the other flags passed to the `new` command, and your settings for the `new` command in your root `package.json`. For future reference, we also support additional flags and configuration. Learn more at [the CLI docs](../../../tooling/cli/03-commands.md#new).

Creating the plugin will take a little while, so be patient. If it runs with no issues, it will run the initial installation and build commands, so that your package is ready to be hacked on!

Once the commands complete, you should see a new folder `plugins/todo-backend` with content like the below tree:

```
/ <- your Backstage app's root directory
    /plugins/
        /todo-backend/
            package.json
            README.md
            eslintrc.js
            /dev/
                index.ts
            /src/
                plugin.ts
                index.ts
                router.ts
                /services/
                    /TodoListService/
                        TodoListService.ts
                        types.ts
                        index.ts
```

<!-- TODO: describe each of the above files -->

### FAQs

<!-- List of commonly occurring problems during install -->
