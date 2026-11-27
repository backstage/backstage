/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'fs-extra';
import { basename, extname, resolve as resolvePath } from 'node:path';
import {
  Compiler,
  Configuration,
  rspack,
  SwcJsMinimizerRspackPlugin,
} from '@rspack/core';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { BundlingPaths } from './paths';
import { BundlingOptions } from './types';
import { transforms } from './transforms';
import { STATIC_ASSET_HASH_LENGTH } from './staticAssetHash';
import { resolveBrowserslistTarget } from './browserslistTarget';

/** The name of the compiler that builds the public sources. */
export const PUBLIC_SOURCES_COMPILER_NAME = 'public-sources';

const SOURCE_EXTENSIONS = ['.ts', '.mts', '.js', '.mjs'];

// Matches `<%= sources.name %>` in the index template
const SOURCE_PLACEHOLDER_PATTERN = /<%=\s*sources\.([A-Za-z_$][\w$]*)\s*%>/g;

/**
 * Finds the files in the public sources folder, keyed by their name without
 * extension. Only files directly in the folder are entries; they can import
 * from subfolders.
 */
export async function findPublicSources(
  paths: BundlingPaths,
): Promise<Record<string, string>> {
  const dir = paths.targetPublicSources;
  if (!(await fs.pathExists(dir))) {
    return {};
  }

  const sources: Record<string, string> = {};
  for (const file of (await fs.readdir(dir)).sort()) {
    const ext = extname(file);
    if (!SOURCE_EXTENSIONS.includes(ext) || file.endsWith('.d.ts')) {
      continue;
    }
    const path = resolvePath(dir, file);
    if (!(await fs.stat(path)).isFile()) {
      continue;
    }
    const name = basename(file, ext);
    if (sources[name]) {
      throw new Error(
        `Public sources ${sources[name]} and ${path} have the same name, rename one of them`,
      );
    }
    sources[name] = path;
  }
  return sources;
}

/**
 * Keeps the output file of each public source, as built by the public sources
 * compiler, for the index templates of the app compilers that depend on it.
 */
export class PublicSourcesRegistry {
  readonly #names: string[];
  #files = new Map<string, string>();

  constructor(names: string[]) {
    this.#names = names;
  }

  get isEmpty() {
    return this.#names.length === 0;
  }

  /** Records the output files of the latest compilation. */
  setFiles(files: Map<string, string>) {
    this.#files = files;
  }

  /**
   * Returns the output file of a source relative to the public path, for
   * example `static/foo.0123456789ab.js`.
   */
  getFile(name: string): string {
    if (!this.#names.includes(name)) {
      const known = this.#names.length
        ? `, the available sources are: ${this.#names.join(', ')}`
        : ', and the app has no public sources';
      throw new Error(
        `The index template refers to the public source '${name}', which does not exist${known}`,
      );
    }
    const file = this.#files.get(name);
    if (!file) {
      throw new Error(`The public source '${name}' has not been built`);
    }
    return file;
  }

  /**
   * Returns the `sources` object for the index template, which maps each
   * source name to the full path of its output file.
   */
  createTemplateParameter(publicPath: string): Record<string, string> {
    return new Proxy(
      {},
      {
        get: (_target, name) =>
          typeof name === 'string'
            ? `${publicPath}/${this.getFile(name)}`
            : undefined,
      },
    );
  }

  /**
   * Replaces the source placeholders in a raw index template with the paths
   * of their output files, relative to the public path placeholder. The rest
   * of the template is left for the app backend to render at runtime.
   */
  resolvePlaceholders(template: string): string {
    return template.replace(
      SOURCE_PLACEHOLDER_PATTERN,
      (_match, name: string) => `<%= publicPath %>/${this.getFile(name)}`,
    );
  }
}

/**
 * Resolves the source placeholders in the raw `index.html.tmpl` output, which
 * the app backend renders at runtime with only the public path and config.
 */
export class PublicSourcesTemplatePlugin {
  readonly name = 'PublicSourcesTemplatePlugin';
  readonly #htmlPlugin: HtmlWebpackPlugin;
  readonly #registry: PublicSourcesRegistry;

  constructor(htmlPlugin: HtmlWebpackPlugin, registry: PublicSourcesRegistry) {
    this.#htmlPlugin = htmlPlugin;
    this.#registry = registry;
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(this.name, compilation => {
      const hooks = HtmlWebpackPlugin.getCompilationHooks(compilation as any);
      hooks.beforeEmit.tap(this.name, data => {
        if (data.plugin !== this.#htmlPlugin) {
          return data;
        }
        return { ...data, html: this.#registry.resolvePlaceholders(data.html) };
      });
    });
  }
}

class PublicSourcesCollectorPlugin {
  readonly name = 'PublicSourcesCollectorPlugin';
  readonly #registry: PublicSourcesRegistry;

  constructor(registry: PublicSourcesRegistry) {
    this.#registry = registry;
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tap(this.name, compilation => {
      const files = new Map<string, string>();
      for (const [name, entrypoint] of compilation.entrypoints) {
        const file = entrypoint
          .getFiles()
          .find((f: string) => f.endsWith('.js'));
        if (file) {
          files.set(name, file);
        }
      }
      this.#registry.setFiles(files);
    });
  }
}

/**
 * Creates the configuration that builds each public source into a standalone
 * classic script, with its own runtime and no chunks shared with the app.
 * Production builds put them under `static/` with a content hash, so that
 * they can be cached for as long as the other static assets.
 */
export function createPublicSourcesConfig(
  paths: BundlingPaths,
  options: Pick<BundlingOptions, 'isDev' | 'webpack'> & {
    publicPath: string;
    sources: Record<string, string>;
    registry: PublicSourcesRegistry;
    outputPath?: string;
  },
): Configuration {
  const { isDev, webpack, publicPath, sources, registry, outputPath } = options;
  // The backend flavor of the transforms leaves out JSX and React Refresh,
  // and inlines the transpilation helpers, which suits standalone scripts.
  // Only the script loaders are used, so styles and other assets can't be
  // imported.
  const { loaders } = transforms({ isDev, isBackend: true, webpack });
  const scriptLoaders = loaders.filter(
    rule =>
      rule.test instanceof RegExp &&
      (rule.test.test('source.ts') || rule.test.test('source.js')),
  );

  const MinifyPlugin = webpack
    ? require('esbuild-loader').EsbuildPlugin
    : SwcJsMinimizerRspackPlugin;
  const bundler = webpack ? (webpack as unknown as typeof rspack) : rspack;

  return {
    name: PUBLIC_SOURCES_COMPILER_NAME,
    mode: isDev ? 'development' : 'production',
    context: paths.targetPath,
    ...resolveBrowserslistTarget(paths, options),
    // An eval source map would need a CSP exception in development
    devtool: isDev ? 'cheap-module-source-map' : 'source-map',
    entry: sources,
    resolve: {
      extensions: ['.ts', '.mts', '.mjs', '.js', '.json'],
      mainFields: ['browser', 'module', 'main'],
    },
    module: { rules: scriptLoaders },
    optimization: {
      minimize: !isDev,
      minimizer: [new MinifyPlugin({ target: 'ES2024', format: 'iife' })],
      runtimeChunk: false,
      splitChunks: false,
    },
    output: {
      path: outputPath ?? paths.targetDist,
      publicPath: `${publicPath}/`,
      filename: isDev
        ? '[name].js'
        : `static/[name].[contenthash:${STATIC_ASSET_HASH_LENGTH}].js`,
      iife: true,
    },
    plugins: [
      new bundler.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          isDev ? 'development' : 'production',
        ),
      }),
      new PublicSourcesCollectorPlugin(registry),
    ],
  };
}

/**
 * Finds the public sources of an app, and creates the registry that its index
 * templates read them from, plus the configuration that builds them if there
 * are any.
 */
export async function preparePublicSources(
  paths: BundlingPaths,
  options: Pick<BundlingOptions, 'isDev' | 'webpack'> & {
    publicPath: string;
    // Where to write the output, defaulting to the app's dist folder
    outputPath?: string;
  },
): Promise<{ registry: PublicSourcesRegistry; config?: Configuration }> {
  const sources = await findPublicSources(paths);
  const registry = new PublicSourcesRegistry(Object.keys(sources));
  if (registry.isEmpty) {
    return { registry };
  }
  return {
    registry,
    config: createPublicSourcesConfig(paths, { ...options, sources, registry }),
  };
}

/**
 * Builds the public sources in watch mode, outside of the dev server, so that
 * they don't get the dev server's client injected. Resolves once the first
 * build has finished, and calls `onRebuild` after each later one.
 */
export async function watchPublicSources(
  config: Configuration,
  options: {
    webpack?: typeof import('webpack');
    onRebuild(): void;
  },
): Promise<{ close(): void }> {
  const bundler = (options.webpack ?? rspack) as typeof rspack;
  const compiler = bundler(config);

  return new Promise((resolve, reject) => {
    let started = false;
    const watching = compiler.watch({}, (error, stats) => {
      if (error || stats?.hasErrors()) {
        const message =
          error?.message ??
          stats?.toString({ all: false, errors: true, colors: false });
        if (!started) {
          reject(new Error(`Failed to build the public sources: ${message}`));
          return;
        }
        console.error(`Failed to rebuild the public sources: ${message}`);
        return;
      }
      if (!started) {
        started = true;
        resolve({ close: () => watching?.close(() => {}) });
      } else {
        options.onRebuild();
      }
    });
  });
}
