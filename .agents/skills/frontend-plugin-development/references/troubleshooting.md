# Troubleshooting

Read when a plugin built with `createFrontendPlugin` fails at startup or at runtime, or something silently does not show up. Find the message or symptom, then follow the link.

App startup problems are reported in two ways by apps created with `createApp`:

- **Errors** replace the app with an error page listing each one.
- **Warnings** only appear in the browser console, under `App startup encountered warnings:`. Codes such as `EXTENSION_IGNORED` and `FEATURE_FLAG_INVALID` are warnings, so the app looks fine while something is missing.

Test utilities such as `renderInTestApp` and `renderTestApp` report neither. Always check the dev app's console after a change.

## By message

| Message                                                                    | Cause                                                                                             | Fix                                                                                                                                        |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `NotImplementedError: No implementation available for apiRef{…}`           | A component calls `useApi` for an API nobody provides                                             | Install the plugin that owns the API, or provide a fake in the dev app or test. See [Dev app](dev-app.md#provide-the-apis-the-plugin-uses) |
| `API_FACTORY_CONFLICT: API '…' is already provided by plugin '…'`          | Two plugins provide the same API. Only the owner (or a module for the owner) may                  | Remove the provider that is not the owner, for example a re-registered `core.*` API. See [Dev app](dev-app.md)                             |
| `Plugin '…' provided duplicate extensions: …`                              | Two extensions of the same kind in one plugin or module have no `name`, or the same `name`        | Give each a unique `name`. See [Plugin packaging](plugin-packaging.md#give-each-extension-of-the-same-kind-a-unique-name)                  |
| `EXTENSION_IGNORED: The '…' extension from the '…' plugin is a duplicate…` | Two installed features provide the same extension ID, often two packages with the same `pluginId` | Uninstall one, or give the plugins distinct IDs                                                                                            |
| `FEATURE_FLAG_INVALID: Plugin '…' declared invalid feature flag '…'`       | The flag name breaks the naming rules, so the flag is not registered                              | Rename it. See [Plugin packaging](plugin-packaging.md#declare-feature-flags-on-the-plugin)                                                 |
| `TS2307: Cannot find module '<package>/src/…'`                             | The package's `exports` field blocks deep imports                                                 | Re-export from `src/index.ts`. See [Plugin packaging](plugin-packaging.md#the-exports-field-blocks-deep-imports)                           |

## By symptom

| Symptom                                                        | Likely cause                                                                                                       | Read                                                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| The plugin's pages, tabs, and APIs never appear, with no error | No default export, wrong `backstage.role`, `./package.json` missing from `exports`, or not a direct app dependency | [Plugin packaging](plugin-packaging.md#packagejson-requirements-for-discovery)                 |
| An entity tab shows up twice                                   | Legacy entity page JSX still renders it alongside the `EntityContentBlueprint`                                     | [Entity content](entity-content.md#moving-a-tab-from-legacy-entity-page-jsx)                   |
| An entity tab or card disappeared after deleting legacy JSX    | The extension is disabled or filtered in `app-config`, or disabled by default                                      | [App integration](app-integration.md#check-app-config-before-deleting-legacy-jsx)              |
| An entity tab appears on different entities than before        | The new `filter` is not equivalent to the old predicate                                                            | [Entity content](entity-content.md#filter-keep-the-same-entities)                              |
| An entity tab is outside its group                             | `group` matches no group definition, or the app's `groups` config replaced the defaults                            | [Entity content](entity-content.md#group)                                                      |
| An old URL now shows "page not found"                          | A legacy redirect route was deleted rather than moved                                                              | [App integration](app-integration.md#move-redirects-to-config)                                 |
| A link renders as nothing, or the link target is undefined     | `useRouteRef` returns `undefined` for an external route that is not bound                                          | Handle `undefined` (`ref?.() ?? fallback`), or set a `defaultTarget` on the external route ref |
| A smoke test passes but the page is broken                     | The test does not assert on the page's content; the error boundary rendered instead                                | [Testing](testing.md#add-a-plugin-smoke-test)                                                  |
