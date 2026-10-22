# App integration

Read when installing a plugin in an app, removing legacy wiring for a plugin that moved to the new frontend system, moving redirects, or enabling and disabling a plugin's extensions in `app-config`.

## Prefer discovery over explicit installation

With `app.packages: all` (the default for new apps), adding the plugin package to the app package's `dependencies` installs it. See [Plugin packaging](plugin-packaging.md) for what the package needs so discovery finds it.

A plugin listed in `createApp({ features: [...] })` that is also discovered is deduplicated, so an explicit entry is redundant but harmless. When cleaning up, remove it if all of these hold:

- The package is in the app package's `dependencies`, and `app.packages` does not exclude it (or does include it, when an `include` list is used).
- Its default export is the plugin or module.
- The import is not used for anything else, such as `bindRoutes` referencing `myPlugin.externalRoutes`. If it is, keep the import and remove only the `features` entry.

Keep explicit entries for features that are not packages, such as modules defined inside the app package, because discovery only reads `dependencies`.

## Remove legacy wiring in the same change

When a plugin moves to the new frontend system, its legacy wiring in the app must go in the same change, or the app renders the plugin twice or keeps importing code that no longer exists:

- Legacy `<Route>` elements for the plugin's pages.
- Entity page JSX for the plugin's tabs and cards, in every entity kind's page, not only the first one you find. See [Entity content](entity-content.md).
- Manual API factories for the plugin's APIs in the app's `apis` list, if the plugin now provides them with `ApiBlueprint`.
- Explicit `features` entries that discovery now covers.

Then search the app for the plugin package and make sure each remaining match is intentional:

```bash
grep -rn "<plugin-package-name>" packages/app/src
```

## Move redirects to config

Redirect routes in the legacy app's route list move to the `app/routes` extension config:

```yaml title="app-config.yaml"
app:
  extensions:
    - app/routes:
        config:
          redirects:
            - from: /old-path
              to: /new-path
            - from: /users/:userId
              to: /profile/:userId
            - from: /d
              to: /docs/*
```

- `from` matches the path and everything below it: `/old-path` also matches `/old-path/sub`. Only `from: /` is matched exactly.
- Named params (`:userId`) in `to` are filled from `from`. `*` in `to` is replaced with the rest of the matched path.
- The incoming query string and fragment are kept, unless `to` sets its own.
- Redirects are matched before regular routes and replace the history entry.

See [App built-in extensions](https://backstage.io/docs/frontend-system/building-apps/built-in-extensions) for the full `app/routes` config.

## Check `app-config` before deleting legacy JSX

Deleting legacy JSX because "the plugin already provides this extension" only works if that extension renders in this app. Before deleting, search the app config for the extension ID:

```bash
grep -rn "entity-card:<plugin-id>\|entity-content:<plugin-id>\|page:<plugin-id>" app-config*.yaml
```

| What you find                                                     | Effect                                                 | Do this in the same change                                                       |
| ----------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| No entry                                                          | The extension uses its defaults from code              | Check that the extension is not `disabled: true` by default in the plugin's code |
| `- entity-card:my-plugin/info: false`                             | Disabled; deleting the JSX removes the card everywhere | Enable it (remove the entry or set it to `true`)                                 |
| An entry with `config.filter` that is narrower than the old JSX's | The card disappears for entities the filter excludes   | Widen the filter, or keep the old behavior another way                           |

See [Configuring extensions](https://backstage.io/docs/frontend-system/building-apps/configuring-extensions) for the config format.
