# @backstage/backend-dynamic-feature-service

This package provides experimental support for **dynamic backend features (plugins and modules)** in Backstage, allowing you to load plugins at runtime from a separate directory without including them in your main application's package.json.

## Purpose

This enables:

- **Plugin distribution**: Distributing plugins as standalone artifacts
- **Runtime flexibility**: Adding or updating plugins without rebuilding the entire application
- **Isolation**: Keeping plugin-specific dependencies separate from core application dependencies
- **Modular deployments**: Different environments can load different sets of plugins

**Important:** This service handles loading only - packaging and distribution are separate concerns with multiple approaches available (see Packaging Approaches section).

## Related Packages

- **`@backstage/frontend-dynamic-feature-loader`**: Companion package for loading dynamic frontend plugins. This is **only** supported in the New Frontend System. For more details, checkout the [README](../frontend-dynamic-feature-loader/README.md).

## How it works

### Core Architecture

The service consists of several key components:

1. **Plugin Scanner**: Scans a configured directory (`dynamicPlugins.rootDirectory`) for plugin packages
2. **Module Loader**: Loads plugin modules
3. **Feature Loader**: Integrates loaded plugins into the Backstage backend system
4. **Frontend Asset Server**: Serves frontend plugin assets (JavaScript, CSS, manifests) over HTTP for dynamic frontend plugins

### Loading Process

1. **Discovery**: The scanner identifies valid plugin packages in the dynamic plugins root directory
2. **Validation**: Each package is validated for required fields (`main`, `backstage.role`)
3. **Loading**: The module loader loads the plugin code
4. **Integration**: Plugins are registered as Backstage features and made available to the backend

## Usage

### Basic Setup

Add the service to your backend application:

1. **Install the package**:

```bash
yarn add @backstage/backend-dynamic-feature-service
```

2. **Add one line to your backend**:

```ts
import { createBackend } from '@backstage/backend-defaults';
import { dynamicPluginsFeatureLoader } from '@backstage/backend-dynamic-feature-service';

const backend = createBackend();
// Add this line to enable dynamic plugin support:
backend.add(dynamicPluginsFeatureLoader);
// ... your other plugins
backend.start();
```

### Configuration

Configure the dynamic plugins directory in your `app-config.yaml`:

```yaml
dynamicPlugins:
  rootDirectory: dynamic-plugins-root
```

## Dynamic Plugin Packaging

### Package Structure Requirements

Before exploring specific packaging approaches, it's important to understand what constitutes a valid dynamic plugin package. Dynamic plugins follow the basic rules of Node.js packages, including:

**Package contents:**

- **package.json**: Package metadata and configuration
- **JavaScript files**: Either loadable by the Node.js CommonJS module loaders for backend plugins, or RSPack/webpack assets for frontend plugins
- **Configuration schema** (optional): JSON schema file (typically `dist/.config-schema.json`) for plugin configuration validation
- **Private dependencies** (optional): Embedded `node_modules` folder containing private dependencies for backend plugins

**Required package.json fields:**

- `name`: Package identifier
- `version`: Package version
- `main`: Entry point to the plugin's JavaScript code
- `backstage.role`: Must be set to `"backend-plugin"` or `"backend-plugin-module"`

### Packaging Approaches

Since this service only handles loading, you would choose a packaging approach based on your plugin's dependencies:

### 1. Simple npm pack

**When to use:** Plugin only uses dependencies that are already provided by the main Backstage application.

**How to apply:**

```bash
cd my-backstage-plugin
yarn pack
# Results in: package.tgz

# Extract to dynamic plugins directory
mkdir -p /path/to/dynamic-plugins-root/my-backstage-plugin
tar -xzf package.tgz -C /path/to/dynamic-plugins-root/my-backstage-plugin --strip-components=1
```

**Why this works:** The plugin can resolve all its dependencies from the main application's `node_modules`.

**Reality:** Most plugins have private dependencies not available in the main application, so this approach has limited applicability.

### 2. Manual packaging with dependency installation

**When to use:** Plugin has private dependencies not available in the main Backstage application.

**How to apply:**

```bash
# Package the plugin
cd my-backstage-plugin
yarn pack

# Extract and install dependencies
mkdir -p /path/to/dynamic-plugins-root/my-backstage-plugin
tar -xzf package.tgz -C /path/to/dynamic-plugin-root/my-backstage-plugin --strip-components=1
cp yarn.lock /path/to/dynamic-plugin-root/my-backstage-plugin
cd /path/to/dynamic-plugins-root/my-backstage-plugin
yarn install  # Installs all the plugin's dependencies
```

**Why this works:** Each plugin gets its own `node_modules` directory with all its dependencies.

**Example scenario:** Plugin needs `axios@1.4.0` which isn't available in the main application.

### 3. Custom packaging CLI tool

**When to use:** When you want to produce self-contained dynamic plugin packages that can be directly extracted without any post-action, and systematically use the core `@backstage` dependencies provided by the Backstage application.

**What a packaging CLI needs to do:**

1. **Analyze plugin dependencies** - Identify which are Backstage core vs private dependencies
2. **Create distribution package** - Generate a new directory with modified structure:
   - Move `@backstage/*` packages from `dependencies` to `peerDependencies` in package.json
   - Keep only private dependencies in the `dependencies` section
   - Keep the built JavaScript code unchanged
   - Include only the filtered private dependencies in `node_modules`
3. **Result** - A self-contained package that uses the main app's `@backstage/*` packages but includes its own private dependencies

**Benefits:**

- Systematic use of main application's `@backstage/*` packages (no version conflicts), enabling the future implementation of `@backstage` dependency version checking at start time
- Self-contained packages with only necessary private dependencies
- No post-installation steps required (extract and run)
- Consistent dependency structure across all dynamic plugins
- Production-ready distribution format

**Example implementation:** The [`@red-hat-developer-hub/cli`](https://github.com/redhat-developer/rhdh-cli) tool implements this approach:

```bash
cd my-backstage-plugin
npx @red-hat-developer-hub/cli@latest plugin export
# Creates a self-contained package with embedded dependencies in the `/dist-dynamic` sub-folder

# Deploy the generated package
cp -r dist-dynamic /path/to/dynamic-plugins-root/my-backstage-plugin
```
