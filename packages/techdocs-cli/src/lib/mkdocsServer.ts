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

export const runMkdocsServer = (options: {
  port?: string;
  useDocker?: boolean;
  dockerImage?: string;
  dockerEntrypoint?: string;
  dockerOptions?: string[];
  onStdout?: RunOnOutput;
  onStderr?: RunOnOutput;
  mkdocsConfigFileName?: string;
  mkdocsParameterClean?: boolean;
  mkdocsParameterDirtyReload?: boolean;
  mkdocsParameterStrict?: boolean;
}): RunChildProcess => {
  const port = options.port ?? '8000';
  const useDocker = options.useDocker ?? true;
  const dockerImage = options.dockerImage ?? 'spotify/techdocs';

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
        '-it',
        ...(options.dockerEntrypoint
          ? ['--entrypoint', options.dockerEntrypoint]
          : []),
        ...(options.dockerOptions || []),
        dockerImage,
        'serve',
        '--dev-addr',
        `0.0.0.0:${port}`,
        ...(options.mkdocsConfigFileName
          ? ['--config-file', options.mkdocsConfigFileName]
          : []),
        ...(options.mkdocsParameterClean ? ['--clean'] : []),
        ...(options.mkdocsParameterDirtyReload ? ['--dirtyreload'] : []),
        ...(options.mkdocsParameterStrict ? ['--strict'] : []),
      ],
      {
        onStdout: options.onStdout,
        onStderr: options.onStderr,
      },
    );
  }

  return run(
    [
      'mkdocs',
      'serve',
      '--dev-addr',
      `127.0.0.1:${port}`,
      ...(options.mkdocsConfigFileName
        ? ['--config-file', options.mkdocsConfigFileName]
        : []),
      ...(options.mkdocsParameterClean ? ['--clean'] : []),
      ...(options.mkdocsParameterDirtyReload ? ['--dirtyreload'] : []),
      ...(options.mkdocsParameterStrict ? ['--strict'] : []),
    ],
    {
      onStdout: options.onStdout,
      onStderr: options.onStderr,
    },
  );
};
