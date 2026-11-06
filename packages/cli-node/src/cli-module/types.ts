/*
 * Copyright 2024 The Backstage Authors
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

import type { BackstagePackageJson } from '../monorepo';

/**
 * Information about the package that a package command is being run in,
 * used to decide whether a toggleable command is enabled.
 *
 * @public
 */
export interface CliPackageContext {
  /**
   * The absolute path to the package directory, which is the directory of
   * the nearest `package.json` at or above the current working directory.
   */
  dir: string;
  /**
   * The contents of the package's `package.json`.
   */
  packageJson: BackstagePackageJson;
}

/**
 * The context provided to a CLI command at the time of execution.
 *
 * Contains the parsed arguments and metadata about the command being run.
 *
 * @public
 */
export interface CliCommandContext {
  /**
   * The remaining arguments passed to the command after the command path
   * has been resolved. This includes both positional arguments and flags.
   *
   * For example, running `backstage-cli repo test --verbose src/` would
   * result in `args` being `['--verbose', 'src/']`.
   */
  args: string[];
  /**
   * Metadata about the command being executed.
   */
  info: {
    /**
     * The full usage string of the command including the program name,
     * for example `"backstage-cli repo test"`.
     */
    usage: string;
    /**
     * The name of the command as defined by its path,
     * for example `"repo test"`.
     */
    name: string;
  };
}

/**
 * A command definition for a Backstage CLI plugin.
 *
 * Each command is identified by a `path` that determines its position in
 * the command tree. For example, a path of `['repo', 'test']` registers
 * the command as `backstage-cli repo test`.
 *
 * Commands can either provide an `execute` function directly, or use a
 * `loader` for deferred loading of the implementation. The loader pattern
 * is recommended for commands with heavy dependencies, as it avoids
 * loading the implementation until the command is actually invoked.
 *
 * @public
 */
export interface CliCommand {
  /**
   * The path segments that define the command's position in the CLI tree.
   * For example, `['repo', 'test']` maps to `backstage-cli repo test`.
   */
  path: string[];
  /**
   * A short description of the command, displayed in help output.
   */
  description: string;
  /**
   * If `true`, the command is deprecated and will be hidden from help output
   * but can still be invoked.
   */
  deprecated?: boolean;
  /**
   * If `true`, the command is experimental and will be hidden from help
   * output but can still be invoked.
   */
  experimental?: boolean;
  /**
   * An optional predicate that makes the command toggleable per package.
   * Only allowed for commands whose path starts with `package`.
   *
   * Several modules may register the same `package` command path as long as
   * at most one of them omits `isEnabled`. When the command is invoked, the
   * predicate of each variant is evaluated against the package at the
   * current working directory. If exactly one variant is enabled it is run;
   * if several are enabled an error is thrown. If none are enabled, the
   * variant without `isEnabled` is run as a fallback, and if there is no
   * fallback an error is thrown.
   *
   * @example
   * ```
   * isEnabled: ({ packageJson }) => Boolean(packageJson.devDependencies?.vitest)
   * ```
   */
  isEnabled?: (context: CliPackageContext) => boolean | Promise<boolean>;
  /**
   * The command implementation, either as a direct function or as a loader
   * that returns the implementation as a default export. The loader form
   * is useful for deferring heavy imports until the command is invoked.
   *
   * @example
   * Direct execution:
   * ```
   * execute: async ({ args }) => { ... }
   * ```
   *
   * @example
   * Deferred loading:
   * ```
   * execute: { loader: () => import('./my-command') }
   * ```
   */
  execute:
    | ((context: CliCommandContext) => Promise<void>)
    | {
        loader: () => Promise<{
          default: (context: CliCommandContext) => Promise<void>;
        }>;
      };
}

/**
 * Options for registering a run target with `addRunTarget`.
 *
 * A run target is invoked as `backstage-cli repo run <name>`. It runs the
 * given `package` command once per package in the workspace, in a separate
 * process, and supports the `--since`, `--include-dependents` and `--watch`
 * flags.
 *
 * @public
 */
export interface CliRunTargetOptions {
  /**
   * A short description of the target, displayed in the `repo run` help
   * output.
   */
  description: string;
  /**
   * The package command to run for each package, for example
   * `['package', 'test']`. Must start with `package`.
   */
  packageCommand: string[];
  /**
   * The `package.json` script that opts a package in to the run target. A
   * package is included if this script starts with
   * `backstage-cli <packageCommand>`, and any further arguments in the script
   * are passed on to the package command.
   *
   * Defaults to the last segment of `packageCommand`.
   */
  scriptName?: string;
  /**
   * Arguments that are always passed to the package command, for example
   * `['--no-watch']`.
   */
  packageArgs?: string[];
  /**
   * Whether `--since` also includes the local dependents of changed packages.
   * Users can override this with `--include-dependents` or
   * `--no-include-dependents`, and it also applies to `--watch` re-runs.
   *
   * Defaults to `true`, because a change in a package can break the packages
   * that depend on it, so selecting only the changed packages would silently
   * miss regressions. Set to `false` for commands where that is not the case.
   */
  includeDependents?: boolean;
}

/**
 * An opaque representation of a Backstage CLI plugin, created
 * using {@link createCliModule}.
 *
 * @public
 */
export interface CliModule {
  readonly $$type: '@backstage/CliModule';
}
