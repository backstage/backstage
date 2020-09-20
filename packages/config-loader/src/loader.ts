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
import { resolve as resolvePath, dirname } from 'path';
import { AppConfig, JsonObject } from '@backstage/config';
import {
  resolveStaticConfig,
  readConfigFile,
  readEnvConfig,
  readSecret,
} from './lib';

export type LoadConfigOptions = {
  // Root paths to search for config files. Config from earlier paths has lower priority.
  rootPaths: string[];

  // The environment that we're loading config for, e.g. 'development', 'production'.
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

export async function loadConfig(
  options: LoadConfigOptions,
): Promise<AppConfig[]> {
  const configs = [];

  const configPaths = await resolveStaticConfig(options);

  try {
    const secretPaths = new Set<string>();

    for (const configPath of configPaths) {
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

  return configs;
}
