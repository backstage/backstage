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
import type { ChildProcess } from 'child_process';
import { ctrlc } from 'ctrlc-windows';
import { IpcServer, ServerDataStore } from '../ipc';
import debounce from 'lodash/debounce';
import { fileURLToPath } from 'url';
import { isAbsolute as isAbsolutePath } from 'path';
import { paths } from '../paths';
import spawn from 'cross-spawn';

const loaderArgs = [
  '--enable-source-maps',
  '--require',
  require.resolve('@backstage/cli/config/nodeTransform.cjs'),
  // TODO: Support modules, although there's currently no way to load them since import() is transpiled tp require()
];

export type RunBackendOptions = {
  /** relative entry point path without extension, e.g. 'src/index' */
  entry: string;
  /** Whether to forward the --inspect flag to the node process */
  inspectEnabled: boolean;
  /** Whether to forward the --inspect-brk flag to the node process */
  inspectBrkEnabled: boolean;
  /** Additional module to require via the --require flag to the node process */
  require?: string;
  /** An external linked workspace to override module resolution towards */
  linkedWorkspace?: string;
};

export async function runBackend(options: RunBackendOptions) {
  const envEnv = process.env as { NODE_ENV: string };
  if (!envEnv.NODE_ENV) {
    envEnv.NODE_ENV = 'development';
  }

  // Set up the parent IPC server and bind the available services
  const server = new IpcServer();
  ServerDataStore.bind(server);

  let exiting = false;
  let firstStart = true;
  let child: ChildProcess | undefined;
  let watcher: FSWatcher | undefined = undefined;
  let shutdownPromise: Promise<void> | undefined = undefined;

  const watchedPaths = new Set<string>();

  const restart = debounce(async () => {
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
      if (process.platform === 'win32' && child.pid) {
        ctrlc(child.pid);
      } else {
        child.kill();
      }
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
      optionArgs.push(`--require=${options.require}`);
    }

    const userArgs = process.argv
      .slice(['node', 'backstage-cli', 'package', 'start'].length)
      .filter(arg => !optionArgs.includes(arg));

    child = spawn(
      process.execPath,
      [...loaderArgs, ...optionArgs, options.entry, ...userArgs],
      {
        stdio: ['ignore', 'inherit', 'inherit', 'ipc'],
        env: {
          ...process.env,
          BACKSTAGE_CLI_LINKED_WORKSPACE: options.linkedWorkspace,
          BACKSTAGE_CLI_CHANNEL: '1',
          ESBK_TSCONFIG_PATH: paths.resolveTargetRoot('tsconfig.json'),
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

  const exitPromise = new Promise<void>(resolveExitPromise => {
    async function handleSignal(signal: NodeJS.Signals) {
      exiting = true;

      // Forward signals to child and wait for it to exit if still running
      if (child && child.exitCode === null) {
        await new Promise(resolve => {
          child!.on('close', resolve);
          child!.kill(signal);
        });
      }

      resolveExitPromise();
    }

    process.once('SIGINT', handleSignal);
    process.once('SIGTERM', handleSignal);
  });

  return () => exitPromise;
}
