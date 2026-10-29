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

import { spawn } from 'node:child_process';
import {
  isAbsolute as isAbsolutePath,
  resolve as resolvePath,
} from 'node:path';
import { z } from 'zod';
import { getPortPromise } from 'portfinder';
import { ConfigSources } from '@backstage/config-loader';
import { targetPaths } from '@backstage/cli-common';
import chalk from 'chalk';
import { ForwardedError } from '@backstage/errors';
import { embeddedPostgresProcess } from './embeddedPostgresProcess';

export interface EmbeddedDbConnectionConfig {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  flags?: {
    postgres?: string[];
    initdb?: string[];
  };
}

const connectionSchema: z.ZodType<EmbeddedDbConnectionConfig> = z.object({
  host: z.string().optional(),
  port: z.number().optional(),
  user: z.string().optional(),
  password: z.string().optional(),
  flags: z
    .object({
      postgres: z.array(z.string()).optional(),
      initdb: z.array(z.string()).optional(),
    })
    .optional(),
});

export interface StartEmbeddedDbOptions {
  configPaths?: string[];
  targetDir?: string;
  signal?: AbortSignal;
}

/**
 * Reads the database configuration from the app config and, if the client is
 * `embedded-postgres`, starts an embedded Postgres instance. Returns the config
 * override to inject into the child process, or `undefined` if the database
 * client is not `embedded-postgres`.
 */
export async function startEmbeddedDb(options: StartEmbeddedDbOptions): Promise<
  | {
      configOverride: Record<string, unknown>;
      close(): Promise<void>;
    }
  | undefined
> {
  options.signal?.throwIfAborted();
  const dbConfig = await readDatabaseConfig(
    options.configPaths,
    options.targetDir,
  );
  options.signal?.throwIfAborted();
  if (dbConfig?.client !== 'embedded-postgres') {
    return undefined;
  }

  return startEmbeddedDbInternal(dbConfig.connection, options.signal);
}

async function startEmbeddedDbInternal(
  userConfig?: EmbeddedDbConnectionConfig,
  signal?: AbortSignal,
) {
  console.warn(
    chalk.yellow(
      'WARNING: Using embedded-postgres for local development is experimental and subject to change',
    ),
  );

  const host = userConfig?.host ?? 'localhost';
  const user = userConfig?.user ?? 'postgres';
  const password = userConfig?.password ?? 'postgres';
  const port = userConfig?.port ?? (await getPortPromise());
  let embeddedPostgresPath: string;
  try {
    embeddedPostgresPath = require.resolve('embedded-postgres');
  } catch (error) {
    throw new ForwardedError(
      `Failed to resolve 'embedded-postgres'. It must be installed as an explicit dependency in your project`,
      error,
    );
  }

  // Isolate both Postgres and the library's exit hooks from terminal signals.
  const child = spawn(
    process.execPath,
    [
      '--eval',
      `(${embeddedPostgresProcess.toString()})(${JSON.stringify(
        embeddedPostgresPath,
      )}, ${JSON.stringify(
        require.resolve('async-exit-hook', { paths: [embeddedPostgresPath] }),
      )})`,
    ],
    {
      detached: true,
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
    },
  );
  child.on('message', (message: { log?: string }) => {
    if (message.log) {
      console.error('[embedded-postgres]', message.log);
    }
  });
  const disconnect = () => {
    child.unref();
    if (child.connected) {
      child.disconnect();
    }
  };
  signal?.addEventListener('abort', disconnect, { once: true });
  if (signal?.aborted) {
    disconnect();
  }
  const exitPromise = new Promise<void>((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Embedded Postgres helper exited with code ${code}`));
      }
    });
  });
  exitPromise.then(
    () => signal?.removeEventListener('abort', disconnect),
    () => signal?.removeEventListener('abort', disconnect),
  );
  // Observe failures even while the backend is running.
  exitPromise.catch(error => console.error(error));

  let aborted: () => void;
  let ready: (message: { ready?: boolean; error?: string }) => void;
  await new Promise<void>((resolve, reject) => {
    aborted = () => reject(signal?.reason);
    ready = message => {
      if (message.error) {
        reject(new Error(message.error));
      } else if (message.ready) {
        resolve();
      }
    };
    child.on('message', ready);
    signal?.addEventListener('abort', aborted, { once: true });
    if (signal?.aborted) {
      aborted();
      return;
    }
    exitPromise.then(
      () =>
        reject(new Error('Embedded Postgres helper exited before starting')),
      reject,
    );
    child.send({ user, password, port, flags: userConfig?.flags });
  })
    .catch(async error => {
      if (child.connected) {
        child.disconnect();
      }
      if (!signal?.aborted) {
        await exitPromise.catch(() => {});
      }
      throw error;
    })
    .finally(() => {
      signal?.removeEventListener('abort', aborted);
      child.removeListener('message', ready);
    });

  child.unref();

  const configOverride: Record<string, unknown> = {
    client: 'pg',
  };
  const defaultedConnection: Record<string, string | number> = {};
  if (!userConfig?.host) {
    defaultedConnection.host = host;
  }
  if (!userConfig?.user) {
    defaultedConnection.user = user;
  }
  if (!userConfig?.password) {
    defaultedConnection.password = password;
  }
  if (!userConfig?.port) {
    defaultedConnection.port = port;
  }
  if (Object.keys(defaultedConnection).length > 0) {
    configOverride.connection = defaultedConnection;
  }

  return {
    configOverride,
    async close() {
      child.ref();
      if (child.connected) {
        child.disconnect();
      }
      await exitPromise;
    },
  };
}

async function readDatabaseConfig(
  configPaths?: string[],
  targetDir?: string,
): Promise<
  | {
      client: string;
      connection?: EmbeddedDbConnectionConfig;
    }
  | undefined
> {
  const rootDir = targetPaths.rootDir;
  const configBaseDir = targetDir ?? rootDir;
  const source = ConfigSources.default({
    rootDir,
    allowMissingDefaultConfig: true,
    argv: (configPaths ?? []).flatMap(p => [
      '--config',
      isAbsolutePath(p) ? p : resolvePath(configBaseDir, p),
    ]),
  });

  const config = await ConfigSources.toConfig(source);
  try {
    const client = config.getOptionalString('backend.database.client');
    if (!client) {
      return undefined;
    }

    // Parse the raw connection value with zod rather than reading sub-keys
    // through the config reader, because the config reader's fallback chain
    // throws when a lower-priority config file has connection as a string.
    const rawConnection = config.getOptional('backend.database.connection');
    const connectionResult = connectionSchema.safeParse(rawConnection);
    const connection = connectionResult.success
      ? connectionResult.data
      : undefined;

    return { client, connection };
  } finally {
    config.close();
  }
}
