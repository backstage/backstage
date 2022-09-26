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

import webpack from 'webpack';
import { createBackendConfig } from './config';
import { resolveBundlingPaths } from './paths';
import { BackendServeOptions } from './types';

export async function serveBackend(options: BackendServeOptions) {
  const paths = resolveBundlingPaths(options);
  const config = await createBackendConfig(paths, {
    ...options,
    isDev: true,
  });

  // Webpack only replaces occurrences of this in code it touches, which does
  // not include dependencies in node_modules. So we set it here at runtime as well.
  (process.env as { NODE_ENV: string }).NODE_ENV = 'development';

  const compiler = webpack(config, (err: Error | undefined) => {
    if (err) {
      console.error(err);
    } else console.log('Build succeeded');
  });

  const waitForExit = async () => {
    for (const signal of ['SIGINT', 'SIGTERM'] as const) {
      process.on(signal, () => {
        // exit instead of resolve. The process is shutting down and resolving a promise here logs an error
        compiler.close(() => process.exit());
      });
    }

    // Block indefinitely and wait for the interrupt signal
    return new Promise(() => {});
  };

  return waitForExit;
}
