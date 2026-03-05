---
title: Dynamic Frontend Plugins
status: provisional
authors:
  - '@Hyperkid123'
owners:
project-areas:
  - core
creation-date: 2024-01-17
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed

When editing BEPs, aim for tightly-scoped, single-topic PRs to keep discussions focused. If you disagree with what is already in a document, open a new PR with suggested changes.
-->

# BEP: <!-- Your short, descriptive title -->

<!-- Before merging the initial BEP PR, create a feature issue and update the below link. You can wait with this step until the BEP is ready to be merged. -->

[**Discussion Issue**](https://github.com/backstage/backstage/issues/22423)

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

<!--
The summary of the BEP is a few paragraphs long and give a high-level overview of the features to be implemented. It should be possible to read *only* the summary and understand what the BEP is proposing to accomplish and what impact it has for users.
-->

The dynamic frontend plugins feature is a way of loading additional frontend plugins at runtime, without the requirement of rebuilding and restarting a running Backstage instance. It also provides a method for packaging and distributing plugins as standalone artifacts, which can be installed directly into Backstage.

This system should significantly improve frontend plugin management for Backstage instances, and makes it possible to deploy changes to the app without rebuilding the app itself.

The dynamic plugins leverage the declarative nature of the new frontend system to define what a plugin is and how it is integrated into the rest of the app.

## Motivation

<!--
This section is for explicitly listing the motivation, goals, and non-goals of
this BEP. Describe why the change is important and the benefits to users.
-->

Being able to dynamically install plugins unlocks new ways of deploying and managing Backstage, and has the potential to hugely improve adoption by lowering the barrier of entry. A Backstage installation currently requires quite a lot of care to maintain, meaning it may not be worth the investment for smaller organizations. By making it possible to set up and maintain a Backstage instance without the need to manage a codebase, we can make Backstage more accessible to a wider audience.

The ability to dynamically install plugins also allows for more isolated development and deployment of plugins. This can benefit organizations with large Backstage projects, where splitting the codebase into multiple smaller projects can improve development experience and autonomy.

### Goals

<!--
List the specific goals of the BEP. What is it trying to achieve? How will we
know that this has succeeded?
-->

The overarching goal of this proposal is to outline the full path of how frontend plugin code in a repository makes it way into an existing Backstage app. As part of this, we define the following:

- **Bundling**: How plugin code is packaged into a portable artifact.
- **Distribution**: How these artifacts are deployed or published and made available for apps to load.
- **Loading**: How an app is able to load these artifacts from remote or local sources at runtime.

Each of these may have multiple possible solutions, in particular the loading and distribution steps. This proposal should aim to provide a solution that makes it possible to re-bundle 3rd party plugins to make it possible to install them dynamically, as well as a simple solution to deploy internal plugins for dynamic installation into an app.

There are a couple of sub-goals that are important for this to work:

- Discover and choose the underlying tooling to enable dynamic frontend plugins.
- An easy way to package existing frontend plugins for dynamic installation.
- Reconfiguring the installed plugins at runtime without rebuilding the app, either declaratively or through code.

### Non-Goals

<!--
What is out of scope for this BEP? Listing non-goals helps to focus discussion
and make progress.
-->

The **integration** of installed plugins and features is not in scope for this proposal, that is the responsibility of the new frontend system.

This proposal does not aim to provide a solution for re-building packages on the fly. Plugins must be pre-built for it to be possible to dynamically install them into an app. This means that a solution where you can directly install existing packages from NPM is not in scope.

This proposal does not contain any form of visual interface for managing dynamically installed plugins. The scope of this proposal only includes configuration of dynamic plugins through static configuration and TypeScript interfaces.

This proposal does not aim to make it possible to add or remove plugins into an already running frontend app instance as created by `createApp` from the Backstage core APIs. The page must be reloaded for any updates to take effect.

## Proposal

<!--
This is where we get down to the specifics of what the proposal actually is.
This should have enough detail that reviewers can understand exactly what
you're proposing, but should not include things like API designs or
implementation.
-->

### Definition of UI dynamic plugin

A dynamic UI plugin (from now just plugin) is a plugin that is not part of the output of a backstage instance build. The plugin and its assets are injected into backstage at runtime. In this case, its injected into the browser at some point during user session.

From the user POV, there is no difference between classic and dynamic plugins.

The difference is known only to maintainers and should be limited to

- build requirements
- integration into backstage

### Dynamic loading tool

Traditional plugins are not dynamic out of the box. Additional changes are required during build time to make a plugin dynamic.

The main application (shell) also requires some changes to be able to load, inject, and propagate mandatory context to dynamic plugins.

Over the last few year, [Module Federation](https://github.com/module-federation) has become the standard when it comes to dynamically load JS modules browser (and nodejs) environment from remote locations and sharing context between the shell and the remote module.

Although there are other options, like externalizing dependencies, the module federation has proven itself as a robust solution to this particular problem.

### Module federation implementation

There are multiple available implementations of module federation.

Historically, module federation was implemented as a [Webpack feature](https://webpack.js.org/). Since then, additional implementations were created. Mainly for [`rspack`](https://www.rspack.dev/) and [Vite](https://github.com/originjs/vite-plugin-federation).

Recent changes _claim_, that all of these module federation implementations should be compatible with each other and there should be no need for locking backstage into a single implementation.

Compatibility between Webpack and `rspack` should available via the [@module-federation/enhanced](https://www.npmjs.com/package/@module-federation/enhanced) package. The compatibility is further [described here](https://www.rspack.dev/blog/module-federation-added-to-rspack.html#introducing-rspack-050).

The Vite plugin claims webpack compatibility as well. The Vite plugin _is not part of the @module-federation_ organization. The extend of compatibility is at this time unknown.

**The level of compatibility has to be tested.** Before then, no decision in regards to which implementation(s) will be used should be made. The chosen tool, or their mix, will shape the design and implementation.

That said, packages from the `@module-federation/*` organization should have higher priority as they are based directly on the module federation concepts and are well supported.

### Plugin integration into shell applications

Plugins should be integrated via the new UI system. The system already provides an asynchronous way of loading plugins. The dynamic plugins can be loaded in a similar fashion.

Plugins should be defined declaratively through configuration. Similar to what was described in this [RFC](https://github.com/backstage/backstage/issues/18372) and in this [issue](https://github.com/backstage/backstage/issues/19545).

### Plugin registry

Because plugins are not available at build time, some sort of registry needs to exist to store the information.

This registry needs to be mutable at runtime (add/remove new plugin metadata) and changes have to be reflected on session refresh.

This is currently an issue as the app config is embedded into JS assets during build time.

Each plugin is required to provide manifest file (metadata) in predefined format. This manifest will be used to inject the plugin assets into the browser.

### Plugin discovery

Plugin discovery is a pre-requisite for Plugin registry. This should be responsible for scanning for available plugins and generating/modifying the plugin registry to always keep it up to date.

### CLI

The following sections contains proposal of new CLI scripts to support the dynamic frontend plugins.

#### Static and Dynamic Plugin Build Differences

The major difference between static and dynamic plugins lies in their dependencies and how they are "installed" into a Backstage instance and whether they are bundled into final JS output during the build.

While static plugins can define their dependencies using the dependencies field inside `package.json`, dynamic (module federation-based) plugins can't.

A dynamic plugin requires all dependencies to be present in the build output. Module sharing is then used to optimize the "output size" at runtime. If a shared package is not found in the browser scope, or if the version range does not match the requirement, it falls back and loads additional JS assets from the "private" build and adds them to the scope.

Webpack is also not the best tool for building traditional NPM packages. Dependencies can be externalized, but Webpack brings additional code into the bundles. Using Webpack external dependencies also conflicts with module federation shared modules. Externals will not be included even as a shared module fallback. As a result, such shared module can't be used because the dependency will not be defined in the init container.

If the vision is to still support "static" plugins installed via NPM, it makes sense to keep the static and dynamic plugin builds separate and build two different bundles. Both can still be published as a single NPM package (not recommended), but to achieve optimal performance for both, there cannot be a shared output.

#### Dynamic export CLI

```sh
backstage-cli plugin export-dynamic
```

Similar to the current build command, instead of producing static plugin output, it builds a dynamic plugin using Webpack and module federation plugins.

**Internal arguments**

Some configuration is required, but they can be internal using the script `cwd`.

- _path_
  - path to the plugin `package.json`
- _export-name_
  - Export name from where the plugin root is accessible
  - defaults to `pluginEntry`

**Shared modules**

> NOTE: Details of module sharing are described in the [Module sharing](#module-sharing) section.

Short summary of dependency sharing:

- Predefined set of singleton packages
- Generated granular config of modules for MUI dependencies
- Share all other dependencies listed in package.json

To allow additional customization of module sharing, extra configuration will be required. The extra module haring configuration can be embedded inside `package.json`.

- [Schema proposal draft](./dependency-sharing-schema.json)
- [Config draft](./share-config-sample.json)

#### Generate module sharing map

> NOTE: RedHat has similar internal generators that are used in combination with Scalprum. These can be built upon, moved to Scalprum, and exposed. If there is interest, the Backstage maintainers do not have to be responsible for maintaining the source code.

A simple program to traverse the AST and find exports from the `main` or `module` script of a dependency. Any exposed modules from the dependency entry will be traced to their source files, and a module map can be generated.

> NOTE: It is important that import paths in source code are also directly targeting the "traced" modules or are transformed at build time.

**The script should be triggered by the plugin build cli**

Generates a module map (exported module source file location) for module sharing.

**Arguments**

- _path_
  - path to the module root (directory with package.json)

[module map generator using TS example](#simplistic-minimal-example-of-module-map-generator)

### Dynamic assets server

A simple static asset server is sufficient to serve the dynamic assets. The asset server can collect the necessary metadata at boot or runtime. The asset server can be added to the `app-backend`

It's important to consider old deployments as part of this storage, to make sure that dynamic chunks are still available to users who have not yet refreshed the page to load the latest version of the app.

#### Plugin separation

- Each plugin should be separated into a directory.
- Each plugin can be viewed as a `private` workspace package in a npm workspaces environment.

```sh
path/to/assets/plugin/dynamic-plugins/
└── dynamic-backstage.plugin-user-settings
    ├── dist
    ├── package.json
    └── plugin-manifest.json
```

#### Boot time initialization

**Dynamically build plugins**

Only dynamic plugins can be hosted in the backend. The plugins has to provide the [manifest](#plugin-manifest). It the manifest is not found, plugin will not be considered dynamic and will be enabled for loading.

**File system assets management**

Once plugins are installed and fully dynamic, the asset server has to "discover" what plugins are loadable.

This can be done by scanning the "assets" (dynamic-plugins in the dir example) for individual plugin manifests. Simple `glob` lookup for `path/dynamic-plugins/**/plugins-manifest.json` pattern should give required results.

With this data the assets server should be able to generate a "plugin registry" with necessary metadata for the frontend. See the [Plugin Registry](#plugin-registry-1) for format details.

The during the collection, the program can also add the `assetHost` prefix to the manifest location attribute described in the [webpack configuration](#sample-webpack-configuration) section.

**Alternative means of assets management**

To manage the assets by other means than just using filesystem, the file system should be treated only as an entry point for the plugins. Leveraging other means such as DB/cache/object storage should be also an option. The storage method should be mandated as long as a plugin registry and assets are available.

**Singleton dependencies verification (optional)**

With [module sharing](#module-sharing) and its singleton option, it is critical that the singleton dependencies versions are matching.

The singleton configuration from the shell application can be extracted as well as from all dynamic plugins (included in the generated [manifest](#plugin-manifest)). A semver check can be used to prevent a plugin from initializing if a version mismatch is found. A version check also has to be made between plugins. New plugin singleton dependencies must match both the shell and all previously loaded plugins.

#### Runtime updates

It is fully expected that plugins can be added or removed at the asset server runtime. The same tasks can be performed as during boot time initialization. It is critical that the plugin registry is not cached and updated immediately if assets change.

The server **should not remove older JS/CSS assets** immediately after updates. It is highly likely user can have older version still loaded in their browsers. A retention period is required for the assets. Using proper content hashes for builds will help with keep the duplicate assets to a minimum.

#### Asset server API

> NOTE Routes names are purely arbitrary at this point.

The API can be very simplistic

_GET /dynamic-plugins/plugin-registry_

Returns generated [Plugin Registry](#plugin-registry-1).

\*GET /dynamic-plugins/assets/\*\*

Static assets endpoint. Can be handled via the `express.static` middleware.

### Plugin loading

> NOTE: Only viable for the new frontend plugin system.

The feature loader is a perfect place to initialize a new dynamic plugin as it already accepts async loaders.

An example of [integration with scalprum](https://github.com/backstage/backstage/commit/23085aa8dfbc73d4648c100cf06b6b67e8e31764).

#### Integration to core

**Dynamic Feature configuration**

The dynamic remote loading can be added directly into the [`createApp`](https://backstage.io/api/stable/functions/_backstage_frontend-defaults.createApp.html) function.

The current `feature` type can be expanded with a `DynamicFrontendFeature` type:

```ts
// current
type Features: (FrontendFeature | CreateAppFeatureLoader)[];

// with dynamic plugins
type DynamicFrontendFeature = {
  name: string;
  manifestLocation: string // URI with host enhanced with the "DEFAULT_API_PATH" or "assetHost" prefix
}

type Features: (FrontendFeature | CreateAppFeatureLoader | DynamicFrontendFeature)[];
```

**Dynamic Feature boot loading**

Scalprum can be initialized with the metadata originating from the dynamic backend plugin. In order to properly load a plugin with `publicPath` set to `auto`, a small transformation of the manifest has to happen before it is loaded. A sample Scalprum config with such transformation:

```TS
import { initialize } from '@scalprum/core';
import { ScalprumProviderProps } from '@scalprum/react-core';

// get the pluginRegistry from the backend plugin
const pluginRegistry = await loadRemoteConfig()

const pluginSDKOptions: ScalprumProviderProps['pluginSDKOptions'] = {
  pluginLoaderOptions: {
    transformPluginManifest: manifest => {
      return {
        ...manifest,
        loadScripts: manifest.loadScripts.map(script => {
          // Any additional transformations can happen here in case the manifest format needs to be adjusted further.
          // the init scripts URL is enhanced with the asset location to add the host:
          return `${manifest.customProperties.assetHost ?? DEFAULT_API_PATH}${script}`;
        }),
      };
    },
  },
};

// Initialize Scalprum instance
const scalprum = initialize({
  appsConfig: pluginRegistry,
  pluginLoaderOptions: pluginSDKOptions.pluginLoaderOptions,
});
```

Because the [`appLoader`](https://backstage.io/api/stable/functions/_backstage_frontend-defaults.createApp.html) is already async, it is a perfect place to load the plugin registry and init the dynamic plugins.

Initializing the dynamic feature is just a case of mapping the `DynamicFrontendFeature` to `FrontendFeature` via Scalprum:

```ts
import { processManifest, getModule } from '@scalprum/core';
// a ID of the module within module federation container, can be customized, depends on the build
const DEFAULT_MODULE_NAME = 'pluginEntry';

async function loadScalprumFeature({ manifestLocation, name }) {
  // initialize dynamic remote within scalprum cache
  await processManifest(manifestLocation, name, DEFAULT_MODULE_NAME);
  // gets the actual JS module from scalprum
  const feature = await getModule<FrontendFeature>(name, DEFAULT_MODULE_NAME);

  return feature;
}
const providedFeatures: FrontendFeature[] = [];
for (const entry of options?.features ?? []) {
  if ('manifestLocation' in entry && 'name' in entry) {
    // some error handling required
    const dynamicFeature = loadScalprumFeature(entry);
    providedFeatures.push(dynamicFeature);
  } else if ('load' in entry) {
    // plugin with load function
  } else {
    // #static plugin
  }
}

const app = createSpecializedApp({
  icons: options?.icons,
  config,
  features: [...discoveredFeatures, ...providedFeatures],
  bindRoutes: options?.bindRoutes,
}).createRoot();
```

The federated modules are now available as if they were static plugins.

## Design Details

### Module federation implementation experiments

> NOTE Experiments were tested and documented. Decision was mated to leverage [Scalprum](https://github.com/scalprum/scaffolding) and [dynamic-plugins-sdk](https://github.com/openshift/dynamic-plugin-sdk). Instead of native webpack module federation the [@module-federation/enhanced](https://www.npmjs.com/package/@module-federation/enhanced) plugin will be used to ensure future compatibility with other bundlers.

Test should consist of trying to run permutations of webpack/Rspack/vite based shell apps/plugins and discover if we can freely choose any tool, or if we should restrict the tooling to just a subset of the available options.

The outcome of initial testing is positive and it is possible to mix and match different build tools and consume different remote modules in a single shell application.

The experimental code can be found in [this repository](https://github.com/scalprum/mf-mixing-experiments).

So far a lot of custom code needs to be written to bridge Webpack, Rspack, @module-federation/enhanced with Vite. The first three are compatible out of the box, but Vite requires extra bridge to be able to consume/provide modules with/to other builds.

#### React context and singleton sharing

We can share React context and its values. Meaning a shell application (or a plugin parent) can have a context provider and a plugin will consume the context value.

An example is this [package](https://github.com/scalprum/mf-mixing-experiments/tree/master/shared-package) in the experiment repo.

The shell apps supply the provider and remote modules consume it. There are no issues with any combination of tooling.

#### Optimized module sharing

Module sharing optimizations are also working nicely. ([Optimization description](https://medium.com/@marvusm.mmi/webpack-module-federation-think-twice-before-sharing-a-dependency-18b3b0e352cb))

Mixing shared scope is working between various modules using various build tools.

Sample configuration:
https://github.com/scalprum/mf-mixing-experiments/blob/master/mixed-remote-modules-collection/webpack.config.js#L27-L41

```js
const plugin = new ModuleFederationPlugin({
  ...
  shared: {
    '@mui/material/Button': {
      requiredVersion: '>=5.0.0',
      version: '5.15.6',
    },
    '@mui/material/TextField': {
      requiredVersion: '>=5.0.0',
      version: '5.15.6',
    },
    '@mui/material/Typography': {
      requiredVersion: '>=5.0.0',
      version: '5.15.6',
    },
    '@mui/material/Divider': {
      requiredVersion: '>=5.0.0',
      version: '5.15.6',
    },
    ...
  },
});

```

This config ensures that only those modules (from @mui/material) that are used in the code will be shared. If a relative imports and the entire dependency name is used, the entire dependency will be shared, regardless of which modules are consumed. Tree shaking does not work when an entire dependency is shared! Explanation of why is described [here](https://medium.com/@marvusm.mmi/webpack-module-federation-think-twice-before-sharing-a-dependency-18b3b0e352cb).

This can be checked by debugging network traffic and shared scopes:

![scope sharing sample](./scope-sharing.png)

### Plugin registry

Plugin registry can be fairly simplistic. It can be as simple as JSON file containing list/map of available plugins and their manifests

```TS
type RegistryEntry = {
  name: string // plugin name
  manifestLocation: string // path to the manifest resource
  assetHost: string // host part of URL to deal with the `auto` publicPath
}

// object for easy access
type PluginRegistry = {
  [pluginName: string]: RegistryEntry
}

// or as an array
type PluginRegistry = RegistryEntry[]
```

Example of such registry

```JS
// as object
{
  "backstage.plugin-github-actions": {
    "name": "backstage.plugin-github-actions",
    "manifestLocation": "/api/plugin-storage/plugin-manifest.json",
    "assetHost": "https://foo-bar.com"
  },
  // ..rest of plugins
}

// as array
[
  {
    "name": "backstage.plugin-github-actions",
    "manifestLocation": "https://foo-bar.com/api/plugin-storage/plugin-manifest.json"
    "assetHost": "https://foo-bar.com"
  },
  // ...rest of plugins
]
```

Scalprum by default lazy loads plugins and manifests. That is because Scalprum initializes plugins only once they are supposed to be rendered in browser.

Because backstage does not require that functionality in initial dynamic plugin implementation and loads all plugins at bootstrap, there is an alternative to embed manifest data into the registry itself.

```TS
type RegistryEntry = {
  name: string // plugin name
  pluginManifest: PluginManifest
}

// object for easy access
type PluginRegistry = {
  [pluginName: string]: RegistryEntry
}

// or as an array
type PluginRegistry = RegistryEntry[]

```

Example of registry with embedded manifests

```JS
// as object
{
  "backstage.plugin-github-actions": {
    "name": "backstage.plugin-github-actions",
    "pluginManifest": {
      "name": "backstage.plugin-github-actions",
      "version": "0.6.6",
      "registrationMethod": "callback",
      "baseURL": "auto",
      "loadScripts": [
        "backstage.plugin-github-actions.804b91040fcbca6585ce.js"
      ],
      "buildHash": "804b91040fcbca6585ce1bcd4b1f8aa2"
    }
  },
  // ..rest of plugins
}

// as array
[
  {
    "name": "backstage.plugin-github-actions",
    "pluginManifest": {
      "name": "backstage.plugin-github-actions",
      "version": "0.6.6",
      "registrationMethod": "callback",
      "baseURL": "auto",
      "loadScripts": [
        "backstage.plugin-github-actions.804b91040fcbca6585ce.js"
      ],
      "buildHash": "804b91040fcbca6585ce1bcd4b1f8aa2"
    }
  },
  // ...rest of plugins
]

```

### Frontend plugin build configuration

#### Build tooling

- webpack module bundler as a base
- use `@openshift/dynamic-plugin-sdk-webpack` to build dynamic frontend output
  - with `@module-federation/enhanced` plugins instead of native webpack

#### Module sharing

Webpack allows for dependency/module sharing across different remote modules. For performance's sake, all dependencies should be shared. The sharing is version-restricted, and there can be multiple versions of the same package at the same time. This ensures that remote modules will have the necessary dependency version available, either from the shared scope or as a fallback from the respective build.

**Singleton sharing**

Singleton sharing is necessary for context sharing between remote modules and between remote modules and shell application.

Only a minimal set of dependencies should be shared as singletons as it gives access to all packages to the parent context. Also **version checking is disabled for singleton packages!**

Singleton "must have" list:

- @scalprum/core
- @scalprum/react-core
- @openshift/dynamic-plugin-sdk
- react
- react-dom
- react-router-dom

Singleton "might have to" list:

- @material-ui/core/styles
- @material-ui/styles

**@mui/_ and @material-ui/_ like packages**

> NOTE: Can leverage [Generate module sharing map](#generate-module-sharing-map).

Component libraries are usually large (thousands of SVG icons in `@mui/icons`) and it is inefficient to share them as a whole. **Tree shaking is disabled for shared modules**. That means sharing large packages in multiple versions will result in a bloated JS in browsers.

Sharing components like these can be done on module level. Instead of sharing the entire package, share its individual components:

```js
const shared = {
  // will result in bloated bundles and degraded performance
  '@mui/material': {
    requiredVersion: 'x.x.x', // semver
  },
  // sharing per module level, only button module is included in the output
  '@mui/material/Button': {
    version: 'x.x.x', // might have to specifically set the version
    requiredVersion: 'x.x.x', // semver
  },
};
```

Sharing dependencies on module level leads to optimal bundle size. Even if all modules from a dependency are listed, Webpack will only bundle modules that are discovered in the source files. That means the list can be generated at build time with no risk of bloating the output with unused modules.

The module sharing "matching" is based on import paths. If relative import paths are used `import {foo} from 'bar'` it will not be matched to the absolute import path of a shared module `import foo from 'bar/foo'`. Therefore absolute import paths have to enforced or path transformation has to happen at build time. For JS builds, babel can be used, for ts builds a `ts-patch` utility with custom plugins is an option.

#### Limitations

A limitation of module sharing is that each module name can only appear once in each context. This means that if you're trying to build a bundle of shared modules with a deeper dependency tree, you may end up needing to resolve conflicts by renaming some modules that appear multiple times with different versions. This will in turn limit sharing of those modules with other bundles.

There is also a conflict with the chunk splitting currently used in the Backstage CLI that means that some singleton modules need to be configured to be eagerly loaded. More broadly we may also want to re-evaluate the chunk splitting strategy in the Backstage CLI when adding support for module federation.

#### Webpack chunk optimization

Custom webpack chunk splitting configuration can be problematic, especially when modifying runtime and vendor chunks. Module federation creates its own chunks. Shared modules that are not set up to be eagerly loaded (using the `eager` configuration) **cannot be included inside the entry script**. With a custom chunk splitting setup, they can potentially be forced into the entry script, causing runtime errors. On the other hand, some critical runtime code that has to be in the entry script, can be forced out of it. This is particularly problematic for the "shell" application.

Chunk optimization should be disabled for the initial implementation.

#### Webpack Public path option

The `publicPath` output config in webpack is a mandatory attribute for federated modules. However, at build time, it is impossible to guess where the assets are served from. From origin to the pathname, this is specific to each installation.

We can leverage the [auto](https://webpack.js.org/guides/public-path/#automatic-publicpath) option. However this means that some manifest transformation has to happen at runtime when entry scripts are loaded into the browser. More on that in the [Plugin manifest](#plugin-manifest), [CDN Plugin](#dynamic-assets-server-plugin), and [Plugin loading](#plugin-loading) sections.

#### Sample webpack configuration

```TS

type DynamicPluginConfig = {
  name: string;
  version?: string;
};
// { name: "@backstage/plugin-api-docs", version: "1.0.0" }
// generates "dynamic-backstage.plugin-api-docs"
const getName = (plugin: DynamicPluginConfig) => {
  let pluginName: string;
  if (plugin.name.includes('/')) {
    const fragments = plugin.name.split('/');
    pluginName = `${fragments[0].replace('@', '')}.${fragments[1]}`;
  } else {
    pluginName = plugin.name;
  }

  return `dynamic-${pluginName}`;
}


// plugin = { name: "@backstage/plugin-api-docs", version: "1.0.0" } based on package.json
const pluginName = getName(plugin);

const { ModuleFederationPlugin, ContainerPlugin } = require('@module-federation/enhanced');

const dynamicPluginPlugin = new DynamicRemotePlugin({
  extensions: [],
  sharedModules, // from shared config and generated from `package.json` dependencies
  entryScriptFilename: `[name].[contenthash].js`, // using contenthash for cashing purposes
  moduleFederationSettings: {
    libraryType: 'global', // use the globalThis object rather than jsonp
    // instruct the sdk plugin to use @module-federation/enhanced tooling
    pluginOverride: {
      ModuleFederationPlugin,
      ContainerPlugin,
    }
  },
  pluginMetadata: {
    name: pluginName,
    version: plugin.version || '0.0.0',
    exposedModules: {
      // path to the default export of the frontend plugin entry point
      // the path should be sourced from the "main" attribute within package.json
      pluginEntry: './src/index.ts',
    },
  },
});


const config: Configuration = {
    context: pluginRoot,
    output: {
      chunkFilename: `${pluginName}.[contenthash].js`,
      path: path.resolve(pluginRoot, 'dist'),
      publicPath: 'auto',
    },
    entry: {},
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    // extend existing webpack plugins that are relevant for dynamic plugins
    plugins: [dynamicPluginPlugin, ...],
    module: {
      rules: [
        {
          // needs TS config as well
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'swc-loader',
          },
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        // additional loaders for CSS if necessary, can use the same as the current backstage shell app
      ],
    },
  };
  return config;
```

**Webpack plugins**

Existing webpack plugins can be used. Subset of shared plugins should be identified from current configurations and shared between the dynamic plugins and the shell application.

### Plugin manifest

Plugin manifest is a simple JSON file containing critical metadata to initialize a remote plugin.

The `@openshift/dynamic-plugin-sdk-webpack` plugin will output manifest file in the following format:

```ts
type PluginManifest = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  customProperties?: AnyObject;
  baseURL: string;
  loadScripts: string[];
  registrationMethod: 'callback' | 'custom';
  buildHash?: string;
};
```

This manifest is directly usable in Scalprum at runtime.

**baseURL**

This attribute is populated by the `output.publicPath` configuration. In this case, it will be a value of `auto`. That is not usable by the Scalprum loader. It has to be a URL.

Because the origin can't be reliably "guessed" at build time, the value has to be filled by the CDN server. The attribute can be either overridden or, preferably, added to the `customProperties` attribute.

A default`DEFAULT_API_PATH` should be used. Covering majority of the use cases.

```ts
type CustomProperties = {
  assetHost?: string; // for local development should be http://localhost:PORT
  // for deployment, should match the api host https://backstage.company.org
};
```

Any additional metadata about plugins, can be also stored to the `customProperties`. Either at build time or runtime. That depends on the use case. The values can be read at runtime during plugin initialization.

```ts
type CustomProperties = {
  backstage: Record<string, any>;
};
```

**Exposing singleton packages config**

Singleton shared packages do not follow the version matching strategy. It is a weak point in the dependency sharing strategy. Exposing the data in the manifest files provides the option to check the singleton configuration at runtime and prevent runtime crashes of plugins.

```ts
type SingletonShareConfig = {
  singleton: true;
  version: string;
  packageName: string;
};

type SingletonShareObject = {
  [packageName: string]: SingletonShareConfig;
};
```

**Backstage plugin manifest**

The plugin manifest for backstage with the additional attributes:

```ts
type SingletonShareConfig = {
  singleton: true;
  version: string;
  packageName: string;
};

type SingletonShareObject = {
  [packageName: string]: SingletonShareConfig;
};

type CustomProperties = {
  assetHost?: string;
  backstage: Record<string, any>;
  singletonPackages: SingletonShareObject;
};

type PluginManifest = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  customProperties: CustomProperties;
  baseURL: 'auto';
  loadScripts: string[];
  registrationMethod: 'custom';
  buildHash?: string;
};
```

### Simplistic minimal example of module map generator

```js
const path = require('path');
const typescript = require('typescript');
const fs = require('fs');

/** @type {typescript.CompilerOptions} */
const defaultCompilerOptions = {
  targe: 'es2015',
  module: 'es2015',
  esModuleInterop: true,
  allowJs: true,
  strict: false,
  skipLibCheck: true,
  noEmit: true,
  // needs to be configured to the root directory dependency
  rootDir: path.resolve(__dirname, 'dist'),
  baseUrl: path.resolve(__dirname, 'dist'),
};

// these need to be configured, usually getting metadata from the lib package.json
const rootDit = path.resolve(__dirname, 'dist');
const base = path.resolve(__dirname, 'dist', 'index.js');

function getDynamicModuleMap(libName) {
  const compiler = typescript.createCompilerHost(defaultCompilerOptions, [
    rootDit,
  ]);
  const program = typescript.createProgram(
    [base],
    defaultCompilerOptions,
    compiler,
  );

  const moduleResolutionCache = typescript.createModuleResolutionCache(
    rootDit,
    x => x,
    defaultCompilerOptions,
  );
  const errorDiagnostics = typescript
    .getPreEmitDiagnostics(program)
    .filter(d => d.category === typescript.DiagnosticCategory.Error);
  if (errorDiagnostics.length > 0) {
    const { getCanonicalFileName, getCurrentDirectory, getNewLine } = compiler;

    console.error(
      typescript.formatDiagnostics(errorDiagnostics, {
        getCanonicalFileName,
        getCurrentDirectory,
        getNewLine,
      }),
    );

    throw new Error(`Detected TypeScript errors while parsing modules`);
  }
  const typeChecker = program.getTypeChecker();

  /** @param {typescript.SourceFile} sourceFile */
  const getExportNames = sourceFile =>
    typeChecker
      .getExportsOfModule(typeChecker.getSymbolAtLocation(sourceFile))
      .map(symbol => symbol.getName());

  const baseExports = getExportNames(program.getSourceFile(base));
  const compilerDir = compiler.getCurrentDirectory();
  const resolvedModules = baseExports
    .map(name => {
      const res = typescript.resolveModuleName(
        name,
        base,
        defaultCompilerOptions,
        compiler,
        moduleResolutionCache,
      );
      if (res.resolvedModule?.resolvedFileName) {
        return {
          name,
          file:
            libName +
            res.resolvedModule.resolvedFileName
              .replace(compilerDir, '')
              .replace(/\.js$/, ''),
        };
      }
      return undefined;
    })
    .filter(x => x !== undefined);

  const moduleMapFileName = path.resolve(__dirname, 'module-map.json');
  fs.writeFileSync(moduleMapFileName, JSON.stringify(resolvedModules, null, 2));
}

const libName = '@mui/foo';

getDynamicModuleMap(libName);

/**
 * [
 *  {
 *    "name": "foo",
 *    "file": "@mui/foo/dist/foo"
 *  },
 *  {
 *    "name": "baz",
 *    "file": "@mui/foo/dist/baz"
 *  }
 * ]
 */
```

### Plugin declarative configuration

Janus dynamic plugins ref: https://github.com/janus-idp/backstage-showcase/blob/main/showcase-docs%2Fdynamic-plugins.md#frontend-layout-configuration

TBD, depends heavily on the new UI system

<!--
This section should contain enough information that the specifics of your
change are understandable. This may include API specs or even code snippets.
If there's any ambiguity about HOW your proposal will be implemented, this is the place to discuss them.
-->

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

## Dependencies

<!--
List any dependencies that this work has on other BEPs or features.
-->

## Alternatives

### Runtime packaging of NPM packages

A solution that has been considered is to allow for the installation of NPM packages directly into the app, with them being repackaged for dynamic installation on the fly. This allows for a more direct way of installing plugins, without the need to change how plugins are published to NPM. The downside of this approach is that it leaves validation and dependency management to the runtime and operator of the Backstage instance.

The NPM ecosystem is built around using version ranges along with lockfiles for dependency management. It is generally up to the maintainers of a repo to make sure that the specific dependency versions installed are all compatible with each other and do not introduce security vulnerabilities. This can be a fairly complex problem, and pushing it to the runtime installation of each plugin ends up being a significant risk.

We consider it to be a better approach to push this responsibility down one step from Backstage operators, either to plugin maintainers, or to a service that is able to bundle and validate plugin bundles before they are installed into a Backstage instance. Building and running such as service as part of the Backstage open source project is out of scope for this proposal, but is something that could be considered in the future.

### Publish dynamic bundle to NPM

We could modify the plugin build process to also output a module federation bundle for dynamic installation. This would also allow for direct installation of plugins directly from NPM, but puts a responsibility on each plugin maintainer to keep publishing new versions of the plugin to NPM simply to update transitive dependencies. This significantly increases the effort of maintaining a Backstage plugin.

The dynamic installation bundle can also be quite large, depending on the dependency tree of each plugin. There is a risk that the size of `node_modules` in a Backstage increases significantly, potentially hurting the development experience by increasing installation time both locally and in CI.
