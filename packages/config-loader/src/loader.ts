/*
 * Copyright 2020 Spotify AB
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
import { resolve as resolvePath, dirname, isAbsolute } from 'path';
import { AppConfig, JsonObject } from '@backstage/config';
import { readConfigFile, readEnvConfig, readSecret, loadSchema } from './lib';

export type LoadConfigOptions = {
  // The root directory of the config loading context. Used to find default configs.
  configRoot: string;

  // Absolute paths to load config files from. Configs from earlier paths have lower priority.
  configPaths: string[];

  // TODO(Rugvip): This will be removed in the future, but for now we use it to warn about possible mistakes.
  env: string;

  // Whether to read secrets or omit them, defaults to false.
  shouldReadSecrets?: boolean;
};

class Context {
  constructor(
    private readonly options: {
      secretPaths: Set<string>;
      env: { [name in string]?: string };
      rootPath: string;
      shouldReadSecrets: boolean;
    },
  ) {}

  get env() {
    return this.options.env;
  }

  skip(path: string): boolean {
    if (this.options.shouldReadSecrets) {
      return false;
    }
    return this.options.secretPaths.has(path);
  }

  async readFile(path: string): Promise<string> {
    return fs.readFile(resolvePath(this.options.rootPath, path), 'utf8');
  }

  async readSecret(
    path: string,
    desc: JsonObject,
  ): Promise<string | undefined> {
    this.options.secretPaths.add(path);
    if (!this.options.shouldReadSecrets) {
      return undefined;
    }

    return readSecret(desc, this);
  }
}

type LoadedConfig = AppConfig[];

export async function loadConfig(
  options: LoadConfigOptions,
): Promise<LoadedConfig> {
  const configs = [];
  const { configRoot } = options;
  const configPaths = options.configPaths.slice();

  const schema = await loadSchema({ dependencies: ['example-backend'] });

  // If no paths are provided, we default to reading
  // `app-config.yaml` and, if it exists, `app-config.local.yaml`
  if (configPaths.length === 0) {
    configPaths.push(resolvePath(configRoot, 'app-config.yaml'));

    const localConfig = resolvePath(configRoot, 'app-config.local.yaml');
    if (await fs.pathExists(localConfig)) {
      configPaths.push(localConfig);
    }

    const envFile = `app-config.${options.env}.yaml`;
    if (await fs.pathExists(resolvePath(configRoot, envFile))) {
      console.error(
        `Env config file '${envFile}' is not loaded as APP_ENV and NODE_ENV-based config loading has been removed`,
      );
      console.error(
        `To load the config file, use --config <path>, listing every config file that you want to load`,
      );
    }
  }

  try {
    const secretPaths = new Set<string>();

    for (const configPath of configPaths) {
      if (!isAbsolute(configPath)) {
        throw new Error(`Config load path is not absolute: '${configPath}'`);
      }
      const config = await readConfigFile(
        configPath,
        new Context({
          secretPaths,
          env: process.env,
          rootPath: dirname(configPath),
          shouldReadSecrets: Boolean(options.shouldReadSecrets),
        }),
      );

      configs.push(config);
    }
  } catch (error) {
    throw new Error(
      `Failed to read static configuration file: ${error.message}`,
    );
  }

  configs.push(...readEnvConfig(process.env));

  return schema.load(configs);
}
