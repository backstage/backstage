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
 * An opaque representation of a Backstage CLI plugin, created
 * using {@link createCliModule}.
 *
 * @public
 */
export interface CliModule {
  readonly $$type: '@backstage/CliModule';
}
