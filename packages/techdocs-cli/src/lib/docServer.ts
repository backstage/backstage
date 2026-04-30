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

import { run, RunChildProcess, RunOnOutput } from '@backstage/cli-common';

/**
 * Default configurations for each generator type
 */
export const generatorDefaults: Record<
  string,
  { dockerImage: string; command: string; servePattern: RegExp }
> = {
  'techdocs-mkdocs': {
    dockerImage: 'spotify/techdocs',
    command: 'mkdocs',
    servePattern: /Serving on (http:\/\/[\d.:]+)/,
  },
  'techdocs-zensical': {
    dockerImage: 'spotify/techdocs-zensical:latest',
    command: 'zensical',
    // Zensical outputs "Serving /path on http://..." format
    servePattern: /Serving .* on (http:\/\/[\d.:]+)/,
  },
};

export type DocServerOptions = {
  port?: string;
  useDocker?: boolean;
  dockerImage?: string;
  dockerEntrypoint?: string;
  dockerOptions?: string[];
  onStdout?: RunOnOutput;
  onStderr?: RunOnOutput;
  configFileName?: string;
  parameterClean?: boolean;
  parameterDirtyReload?: boolean;
  parameterStrict?: boolean;
  generatorType?: string;
};

export const runDocServer = (options: DocServerOptions): RunChildProcess => {
  const port = options.port ?? '8000';
  const useDocker = options.useDocker ?? true;
  const generatorType = options.generatorType ?? 'techdocs-mkdocs';
  const defaults =
    generatorDefaults[generatorType] ?? generatorDefaults['techdocs-mkdocs'];
  const dockerImage = options.dockerImage ?? defaults.dockerImage;
  const localCommand = defaults.command;

  if (useDocker) {
    return run(
      [
        'docker',
        'run',
        '--rm',
        '-w',
        '/content',
        '-v',
        `${process.cwd()}:/content`,
        '-p',
        `${port}:${port}`,
        ...(process.stdin.isTTY ? ['-it'] : []),
        ...(options.dockerEntrypoint
          ? ['--entrypoint', options.dockerEntrypoint]
          : []),
        ...(options.dockerOptions || []),
        dockerImage,
        'serve',
        '--dev-addr',
        `0.0.0.0:${port}`,
        ...(options.configFileName
          ? ['--config-file', options.configFileName]
          : []),
        ...(options.parameterClean ? ['--clean'] : []),
        ...(options.parameterDirtyReload ? ['--dirtyreload'] : []),
        ...(options.parameterStrict ? ['--strict'] : []),
      ],
      {
        onStdout: options.onStdout,
        onStderr: options.onStderr,
      },
    );
  }

  return run(
    [
      localCommand,
      'serve',
      '--dev-addr',
      `127.0.0.1:${port}`,
      ...(options.configFileName
        ? ['--config-file', options.configFileName]
        : []),
      ...(options.parameterClean ? ['--clean'] : []),
      ...(options.parameterDirtyReload ? ['--dirtyreload'] : []),
      ...(options.parameterStrict ? ['--strict'] : []),
    ],
    {
      onStdout: options.onStdout,
      onStderr: options.onStderr,
    },
  );
};

/**
 * @deprecated Use runDocServer instead
 */
export const runMkdocsServer = runDocServer;
