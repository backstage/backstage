# @backstage/backend-dynamic-feature-service

This package adds experimental support for **dynamic backend features (plugins and modules)**, according to the content of the proposal in [RFC 18390](https://github.com/backstage/backstage/issues/18390)

## Testing the backend dynamic plugins feature

In order to test the dynamic backend plugins feature provided by this package, example applications, as well as example dynamic plugins have been provided in provided in the [showcase repository](https://github.com/janus-idp/dynamic-backend-plugins-showcase), and instructions are provided in the [related Readme](https://github.com/janus-idp/dynamic-backend-plugins-showcase#readme).

## How it works

The dynamic plugin manager is a service that scans a configured root directory (`dynamicPlugins.rootDirectory` in the app config) for dynamic plugin packages, and loads them dynamically.

In the `backend` application, it can be enabled by adding the `backend-dynamic-feature-service` as a dependency in the `package.json` and the following lines in the `src/index.ts` file:

```ts
const backend = createBackend();
+
+ backend.add(dynamicPluginsFeatureLoader) // provides features loaded by dynamic plugins
+
```

### About the expected dynamic plugin structure

Due to some limitations of the current backstage codebase, the plugins need to be completed and repackaged to by used as dynamic plugins:

1. they must provide a named entry point (`dynamicPluginInstaller`) of a specific type (`BackendDynamicPluginInstaller`), as can be found in the `src/dynamic` sub-folder of each dynamic plugin example provided in the [showcase repository](https://github.com/janus-idp/dynamic-backend-plugins-showcase).
2. they would have a modified `package.json` file in which dependencies are updated to share `@backstage` dependencies with the main application.
3. they may embed some dependency whose code is then merged with the plugin code.

Points 2 and 3 can be done by the `export-dynamic-plugin` CLI command used to perform the repackaging

### About the `export-dynamic-plugin` command

The `export-dynamic-plugin` CLI command, used the dynamic plugin examples provided in the [showcase repository](https://github.com/janus-idp/dynamic-backend-plugins-showcase), is part of the `@janus-idp/cli` package, and can be used to help packaging the dynamic plugins according to the constraints mentioned above, in order to allow straightforward testing of the dynamic plugins feature.

However the `backend-dynamic-feature-service` experimental package does **not** depend on the use of this additional CLI command, and in future steps of this backend dynamic plugin work, the use of such a dedicated command might not even be necessary.

### About the support of the legacy backend system

The backend dynamic plugins feature clearly targets the new backend system.
However some level of compatibility is provided with current backstage codebase, which still uses the legacy backend system, in order to allow testing and exploring dynamic backend plugin support on the widest range of contexts and installations.
However, this is temporary and will be removed once the next backend is ready to be used and has completely replaced the old one.
This is why the API related to the old backend is already marked as deprecated.

### Future work

The current implementation of the dynamic plugin manager is a first step towards the final implementation of the dynamic features loading, which will be completed / simplified in future steps, as the status of the backstage codebase allows it.
