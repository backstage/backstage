/*
 * Copyright 2020 The Backstage Authors
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

import { FSWatcher, watch } from 'chokidar';
import type { ChildProcess } from 'node:child_process';
import { IpcServer, ServerDataStore } from '../ipc';
import debounce from 'lodash/debounce';
import { fileURLToPath } from 'node:url';
import { isAbsolute as isAbsolutePath } from 'node:path';
import { targetPaths } from '@backstage/cli-common';

import spawn from 'cross-spawn';
import { startEmbeddedDb } from './startEmbeddedDb';

const loaderArgs = [
  '--enable-source-maps',
  '--require',
  require.resolve('@backstage/cli-node/config/nodeTransform.cjs'),
  // TODO: Support modules, although there's currently no way to load them since import() is transpiled to require()
];

export type RunBackendOptions = {
  /** The directory to run the backend process in, defaults to cwd */
  targetDir?: string;
  /** relative entry point path without extension, e.g. 'src/index' */
  entry: string;
  /** Whether to forward the --inspect flag to the node process */
  inspectEnabled?: boolean | string;
  /** Whether to forward the --inspect-brk flag to the node process */
  inspectBrkEnabled?: boolean | string;
  /** Additional module to require via the --require flag to the node process */
  require?: string | string[];
  /** An external linked workspace to override module resolution towards */
  linkedWorkspace?: string;
  /** Config file paths from --config flags */
  configPaths?: string[];
};

function requestShutdown(child: ChildProcess) {
  if (child.connected) {
    child.send({ type: '@backstage/cli/channel/shutdown' }, error => {
      if (error && child.exitCode === null && child.signalCode === null) {
        child.kill();
      }
    });
  } else {
    child.kill();
  }
}

export async function runBackend(options: RunBackendOptions) {
  const envEnv = process.env as { NODE_ENV: string };
  if (!envEnv.NODE_ENV) {
    envEnv.NODE_ENV = 'development';
  }

  // Set up the parent IPC server and bind the available services
  const server = new IpcServer();
  ServerDataStore.bind(server);

  const extraEnv: Record<string, string> = {};

  let exiting = false;
  let firstStart = true;
  let child: ChildProcess | undefined;
  let watcher: FSWatcher | undefined = undefined;
  let shutdownPromise: Promise<void> | undefined;
  let embeddedDb: Awaited<ReturnType<typeof startEmbeddedDb>>;
  let restart: ReturnType<typeof debounce> | undefined = undefined;
  const startup = new AbortController();
  let resolveExitPromise: () => void;
  let rejectExitPromise: (error: unknown) => void;
  const exitPromise = new Promise<void>((resolve, reject) => {
    resolveExitPromise = resolve;
    rejectExitPromise = reject;
  });

  async function handleSignal(signal: NodeJS.Signals) {
    if (exiting && signal !== 'SIGINT') {
      return;
    }
    exiting = true;
    if (signal === 'SIGINT' || !embeddedDb) {
      startup.abort();
    }
    restart?.cancel();
    void watcher?.close();

    if (signal === 'SIGINT') {
      // Do not wait for plugin hooks, including a drain already in progress.
      child?.kill('SIGKILL');
    } else {
      if (child && child.exitCode === null && child.signalCode === null) {
        await new Promise<void>(resolve => {
          child!.once('close', resolve);
          requestShutdown(child!);
        });
      }
      await embeddedDb?.close();
    }
    resolveExitPromise();
  }

  const signalHandler = (signal: NodeJS.Signals) => {
    handleSignal(signal).catch(rejectExitPromise);
  };
  process.once('SIGINT', signalHandler);
  process.once('SIGTERM', signalHandler);

  try {
    embeddedDb = await Promise.race([
      startEmbeddedDb({
        configPaths: options.configPaths,
        targetDir: options.targetDir,
        signal: startup.signal,
      }),
      exitPromise.then(() => undefined),
    ]);
  } catch (error) {
    if (!exiting) {
      throw error;
    }
  }
  if (exiting) {
    return () => exitPromise;
  }
  if (embeddedDb) {
    extraEnv.APP_CONFIG_backend_database = JSON.stringify(
      embeddedDb.configOverride,
    );
  }

  const watchedPaths = new Set<string>();

  restart = debounce(async () => {
    if (exiting) {
      return;
    }
    if (firstStart) {
      firstStart = false;
    } else {
      console.log();
      console.log('Change detected, restarting the development server...');
      console.log();
    }
    // If a re-trigger happens during an existing shutdown, we just ignore it
    if (shutdownPromise) {
      return;
    }

    if (child && !child.killed && child.exitCode === null) {
      // We always wait for the existing process to exit, to make sure we don't get IPC conflicts
      shutdownPromise = new Promise(resolve => child!.once('exit', resolve));
      requestShutdown(child);
      await shutdownPromise;
      shutdownPromise = undefined;
    }

    // We've received a shutdown signal
    if (exiting) {
      return;
    }

    const optionArgs = new Array<string>();
    if (options.inspectEnabled) {
      const inspect =
        typeof options.inspectEnabled === 'string'
          ? `--inspect=${options.inspectEnabled}`
          : '--inspect';
      optionArgs.push(inspect);
    } else if (options.inspectBrkEnabled) {
      const inspect =
        typeof options.inspectBrkEnabled === 'string'
          ? `--inspect-brk=${options.inspectBrkEnabled}`
          : '--inspect-brk';
      optionArgs.push(inspect);
    }
    if (options.require) {
      const requires = [options.require].flat();
      for (const r of requires) {
        optionArgs.push(`--require=${r}`);
      }
    }

    const userArgs = process.argv
      .slice(['node', 'backstage-cli', 'package', 'start'].length)
      .filter(arg => !optionArgs.includes(arg));

    child = spawn(
      process.execPath,
      [...loaderArgs, ...optionArgs, options.entry, ...userArgs],
      {
        stdio: ['ignore', 'inherit', 'inherit', 'ipc'],
        cwd: options.targetDir,
        env: {
          ...process.env,
          ...extraEnv,
          BACKSTAGE_CLI_LINKED_WORKSPACE: options.linkedWorkspace,
          BACKSTAGE_CLI_CHANNEL: '1',
          BACKSTAGE_CLI_BACKEND_LIFECYCLE: '1',
          ESBK_TSCONFIG_PATH: targetPaths.resolveRoot('tsconfig.json'),
        },
        serialization: 'advanced',
      },
    );

    server.addChild(child);

    // This captures messages sent by @esbuild-kit/cjs-loader
    child.on('message', (data: { type?: string } | null) => {
      if (!watcher) {
        return;
      }
      if (typeof data === 'object' && data?.type === 'watch') {
        let path = (data as { path: string }).path;
        if (path.startsWith('file:')) {
          path = fileURLToPath(path);
        }

        if (isAbsolutePath(path) && !watchedPaths.has(path)) {
          watchedPaths.add(path);
          watcher.add(path);
        }
      }
    });
  }, 100);

  restart();

  watcher = watch(['./package.json'], {
    cwd: process.cwd(),
    ignoreInitial: true,
    ignorePermissionErrors: true,
  }).on('all', restart);

  // Trigger restart on hitting enter in the terminal
  process.stdin.on('data', restart);

  return () => exitPromise;
}
