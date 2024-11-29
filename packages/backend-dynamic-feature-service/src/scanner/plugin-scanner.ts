/*
 * Copyright 2023 The Backstage Authors
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
import { Config } from '@backstage/config';
import { ScannedPluginPackage, ScannedPluginManifest } from './types';
import * as fs from 'fs/promises';
import { Stats, lstatSync, existsSync } from 'fs';
import * as chokidar from 'chokidar';
import * as path from 'path';
import * as url from 'url';
import debounce from 'lodash/debounce';
import { LoggerService } from '@backstage/backend-plugin-api';
import { ForwardedError } from '@backstage/errors';

export interface DynamicPluginScannerOptions {
  config: Config;
  backstageRoot: string;
  logger: LoggerService;
  preferAlpha?: boolean;
}

export interface ScanRootResponse {
  packages: ScannedPluginPackage[];
}

export const configKey = 'dynamicPlugins';

export class PluginScanner {
  private _rootDirectory?: string;
  private configUnsubscribe?: () => void;
  private rootDirectoryWatcher?: chokidar.FSWatcher;
  private subscribers: (() => void)[] = [];

  private constructor(
    private readonly config: Config,
    private readonly logger: LoggerService,
    private readonly backstageRoot: string,
    private readonly preferAlpha: boolean,
  ) {}

  static create(options: DynamicPluginScannerOptions): PluginScanner {
    const scanner = new PluginScanner(
      options.config,
      options.logger,
      options.backstageRoot,
      options.preferAlpha || false,
    );
    scanner.applyConfig();
    return scanner;
  }

  subscribeToRootDirectoryChange(subscriber: () => void) {
    this.subscribers.push(subscriber);
  }

  get rootDirectory(): string | undefined {
    return this._rootDirectory;
  }

  private applyConfig(): void | never {
    const dynamicPlugins = this.config.getOptional(configKey);
    if (!dynamicPlugins) {
      this.logger.info(`'${configKey}' config entry not found.`);
      this._rootDirectory = undefined;
      return;
    }
    if (typeof dynamicPlugins !== 'object') {
      this.logger.warn(`'${configKey}' config entry should be an object.`);
      this._rootDirectory = undefined;
      return;
    }
    if (!('rootDirectory' in dynamicPlugins)) {
      this.logger.warn(
        `'${configKey}' config entry does not contain the 'rootDirectory' field.`,
      );
      this._rootDirectory = undefined;
      return;
    }
    if (typeof dynamicPlugins.rootDirectory !== 'string') {
      this.logger.warn(
        `'${configKey}.rootDirectory' config entry should be a string.`,
      );
      this._rootDirectory = undefined;
      return;
    }

    const dynamicPluginsRootPath = path.isAbsolute(dynamicPlugins.rootDirectory)
      ? path.resolve(dynamicPlugins.rootDirectory)
      : path.resolve(this.backstageRoot, dynamicPlugins.rootDirectory);

    if (
      !path
        .dirname(dynamicPluginsRootPath)
        .startsWith(path.resolve(this.backstageRoot))
    ) {
      const nodePath = process.env.NODE_PATH;
      const backstageNodeModules = path.resolve(
        this.backstageRoot,
        'node_modules',
      );
      if (
        !nodePath ||
        !nodePath.split(path.delimiter).includes(backstageNodeModules)
      ) {
        throw new Error(
          `Dynamic plugins under '${dynamicPluginsRootPath}' cannot access backstage modules in '${backstageNodeModules}'.\n` +
            `Please add '${backstageNodeModules}' to the 'NODE_PATH' when running the backstage backend.`,
        );
      }
    }
    if (!lstatSync(dynamicPluginsRootPath).isDirectory()) {
      throw new Error('Not a directory');
    }

    this._rootDirectory = dynamicPluginsRootPath;
  }

  async scanRoot(): Promise<ScanRootResponse> {
    if (!this._rootDirectory) {
      return { packages: [] };
    }

    const dynamicPluginsLocation = this._rootDirectory;
    const scannedPlugins: ScannedPluginPackage[] = [];
    for (const dirEnt of await fs.readdir(dynamicPluginsLocation, {
      withFileTypes: true,
    })) {
      const pluginDir = dirEnt;

      if (pluginDir.name === 'lost+found') {
        this.logger.debug(`skipping '${pluginDir.name}' system directory`);
        continue;
      }
      const pluginHome = path.normalize(
        path.resolve(dynamicPluginsLocation, pluginDir.name),
      );
      if (dirEnt.isSymbolicLink()) {
        if (!(await fs.lstat(await fs.readlink(pluginHome))).isDirectory()) {
          this.logger.info(
            `skipping '${pluginHome}' since it is not a directory`,
          );
          continue;
        }
      } else if (!dirEnt.isDirectory()) {
        this.logger.info(
          `skipping '${pluginHome}' since it is not a directory`,
        );
        continue;
      }

      let scannedPlugin: ScannedPluginPackage;
      try {
        scannedPlugin = await this.scanDir(pluginHome);
        if (!scannedPlugin.manifest.main) {
          throw new Error("field 'main' not found in 'package.json'");
        }
        if (!scannedPlugin.manifest.backstage?.role) {
          throw new Error("field 'backstage.role' not found in 'package.json'");
        }
      } catch (e) {
        if (e instanceof ForwardedError) {
          this.logger.error(e.message, e.cause);
        } else {
          this.logger.error(
            `failed to load dynamic plugin manifest from '${pluginHome}'`,
            e,
          );
        }
        continue;
      }
      scannedPlugins.push(scannedPlugin);
    }
    return { packages: scannedPlugins };
  }

  private async scanDir(pluginHome: string): Promise<ScannedPluginPackage> {
    const manifestFile = path.resolve(pluginHome, 'package.json');
    const content = await fs.readFile(manifestFile);
    const manifest: ScannedPluginManifest = JSON.parse(content.toString());
    const scannedPluginPackage: ScannedPluginPackage = {
      location: url.pathToFileURL(pluginHome),
      manifest: manifest,
    };

    if (this.preferAlpha) {
      const pluginHomeAlpha = path.resolve(pluginHome, 'alpha');
      if (existsSync(pluginHomeAlpha)) {
        if ((await fs.lstat(pluginHomeAlpha)).isDirectory()) {
          try {
            const alphaContent = await fs.readFile(
              path.resolve(pluginHomeAlpha, 'package.json'),
            );
            scannedPluginPackage.alphaManifest = JSON.parse(
              alphaContent.toString(),
            );
          } catch (e) {
            throw new ForwardedError(
              `failed to load dynamic plugin manifest from '${pluginHome}/alpha'`,
              e,
            );
          }
        } else {
          this.logger.warn(
            `skipping '${pluginHomeAlpha}' since it is not a directory`,
          );
        }
      }
    }

    return scannedPluginPackage;
  }

  async trackChanges(): Promise<void> {
    const setupRootDirectoryWatcher = async (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!this._rootDirectory) {
          resolve();
          return;
        }
        const callSubscribers = debounce(() => {
          this.subscribers.forEach(s => s());
        }, 500);
        let ready = false;
        this.rootDirectoryWatcher = chokidar
          .watch(this._rootDirectory, {
            ignoreInitial: true,
            followSymlinks: true,
            depth: 1,
            disableGlobbing: true,
          })
          .on(
            'all',
            (
              event: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
              eventPath: string,
              _: Stats | undefined,
            ): void => {
              if (
                (['addDir', 'unlinkDir'].includes(event) &&
                  path.dirname(eventPath) === this._rootDirectory) ||
                (['add', 'unlink', 'change'].includes(event) &&
                  path.dirname(path.dirname(eventPath)) ===
                    this._rootDirectory &&
                  path.basename(eventPath) === 'package.json')
              ) {
                this.logger.info(
                  `rootDirectory changed (${event} - ${eventPath}): scanning plugins again`,
                );
                callSubscribers();
              } else {
                this.logger.debug(
                  `rootDirectory changed (${event} - ${eventPath}): no need to scan plugins again`,
                );
              }
            },
          )
          .on('error', (error: Error) => {
            this.logger.error(
              `error while watching '${this.rootDirectory}'`,
              error,
            );
            if (!ready) {
              reject(error);
            }
          })
          .on('ready', () => {
            ready = true;
            resolve();
          });
      });
    };

    await setupRootDirectoryWatcher();
    if (this.config.subscribe) {
      const { unsubscribe } = this.config.subscribe(async (): Promise<void> => {
        const oldRootDirectory = this._rootDirectory;
        try {
          this.applyConfig();
        } catch (e) {
          this.logger.error(
            'failed to apply new config for dynamic plugins',
            e,
          );
        }
        if (oldRootDirectory !== this._rootDirectory) {
          this.logger.info(
            `rootDirectory changed in Config from '${oldRootDirectory}' to '${this._rootDirectory}'`,
          );
          this.subscribers.forEach(s => s());
          if (this.rootDirectoryWatcher) {
            await this.rootDirectoryWatcher.close();
          }
          await setupRootDirectoryWatcher();
        }
      });
      this.configUnsubscribe = unsubscribe;
    }
  }

  async untrackChanges() {
    if (this.rootDirectoryWatcher) {
      this.rootDirectoryWatcher.close();
    }
    if (this.configUnsubscribe) {
      this.configUnsubscribe();
    }
  }

  destructor() {
    this.untrackChanges();
  }
}
