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

import type { LoggerService } from '@backstage/backend-plugin-api';
import type { Config } from '@backstage/config';
import {
  ConfigSchema,
  enumerateConfigSecrets,
  loadConfigSchema,
} from '@backstage/config-loader';
import { getPackages } from '@manypkg/get-packages';
import { TASK_REDACTION_OVERFLOW } from './TaskRedacter';

type SecretListener = (secrets: ReadonlySet<string>) => void;

const schemaCache = new Map<string, Promise<ConfigSchema>>();

function loadSchema(options: {
  dir: string;
  logger: LoggerService;
}): Promise<ConfigSchema> {
  const cached = schemaCache.get(options.dir);
  if (cached) {
    return cached;
  }

  const promise = getPackages(options.dir).then(({ packages }) =>
    loadConfigSchema({
      dependencies: packages.map(p => p.packageJson.name),
      onSchemaError: error => options.logger.warn(error.message),
    }),
  );
  schemaCache.set(options.dir, promise);
  promise.catch(() => {
    if (schemaCache.get(options.dir) === promise) {
      schemaCache.delete(options.dir);
    }
  });
  return promise;
}

/** Holds only the current service configuration secrets, never task values. */
export class SystemSecretSource {
  readonly #config: Config;
  readonly #schema: ConfigSchema;
  readonly #listeners = new Set<SecretListener>();
  readonly #configSubscription?: { unsubscribe(): void };
  #secrets = new Set<string>();

  static async create(options: {
    config: Config;
    logger: LoggerService;
    dir?: string;
    schema?: ConfigSchema;
  }): Promise<SystemSecretSource> {
    const schema =
      options.schema ??
      (await loadSchema({
        dir: options.dir ?? process.cwd(),
        logger: options.logger,
      }));
    return new SystemSecretSource({ config: options.config, schema });
  }

  constructor(options: { config: Config; schema: ConfigSchema }) {
    this.#config = options.config;
    this.#schema = options.schema;
    this.#configSubscription = this.#config.subscribe?.(() => this.#refresh());
    this.#refresh();
  }

  subscribe(listener: SecretListener): {
    secrets: ReadonlySet<string>;
    unsubscribe(): void;
  } {
    this.#listeners.add(listener);
    return {
      secrets: new Set(this.#secrets),
      unsubscribe: () => this.#listeners.delete(listener),
    };
  }

  close(): void {
    this.#configSubscription?.unsubscribe();
    this.#listeners.clear();
  }

  #refresh(): void {
    try {
      this.#secrets = enumerateConfigSecrets({
        config: this.#config,
        schema: this.#schema,
      });
    } catch {
      this.#secrets = new Set([TASK_REDACTION_OVERFLOW]);
    }
    for (const listener of this.#listeners) {
      listener(new Set(this.#secrets));
    }
  }
}
