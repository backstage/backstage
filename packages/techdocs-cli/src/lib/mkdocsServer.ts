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

import { ChildProcess } from 'child_process';
import { run, LogFunc } from './run';
import Docker from 'dockerode';
import { PassThrough, Writable } from 'stream';

export const runMkdocsServer = async (options: {
  port?: string;
  useDocker?: boolean;
  dockerClient?: Docker;
  dockerImage?: string;
  dockerEntrypoint?: string;
  dockerOptions?: string[];
  stdoutLogFunc?: LogFunc;
  stderrLogFunc?: LogFunc;
  mkdocsConfigFileName?: string;
  mkdocsParameterClean?: boolean;
  mkdocsParameterDirtyReload?: boolean;
  mkdocsParameterStrict?: boolean;
}): Promise<ChildProcess | Docker.Container> => {
  const port = options.port ?? '8000';
  const useDocker = options.useDocker ?? true;
  const dockerImage = options.dockerImage ?? 'spotify/techdocs';

  if (useDocker) {
    if (!options.dockerClient) {
      throw new Error('requires a Docker client when in Docker mode');
    }

    let args = [
      'serve',
      '--dev-addr',
      `0.0.0.0:${port}`,
      ...(options.mkdocsConfigFileName
        ? ['--config-file', options.mkdocsConfigFileName]
        : []),
      ...(options.mkdocsParameterClean ? ['--clean'] : []),
      ...(options.mkdocsParameterDirtyReload ? ['--dirtyreload'] : []),
      ...(options.mkdocsParameterStrict ? ['--strict'] : []),
    ];

    await new Promise<void>((resolve, reject) => {
      options.dockerClient?.pull(dockerImage, {}, (err, stream) => {
        if (err) return reject(err);
        stream.pipe(new PassThrough(), { end: false });
        stream.on('end', () => resolve());
        stream.on('error', (error: Error) => reject(error));
        return undefined;
      });
    });

    const container = await options.dockerClient?.createContainer({
      Image: dockerImage,
      Cmd: args,
      WorkingDir: '/content',
      HostConfig: {
        Binds: [`${process.cwd()}:/content`],
        PortBindings: {
          [port]: [{ HostPort: port }],
        },
      },
    })!;

    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
    });
    let stdout: Writable = new PassThrough();
    let stderr: Writable = new PassThrough();

    if (options.stdoutLogFunc) {
      stdout = new Writable({
        write(chunk, _, cb) {
          options.stdoutLogFunc?.(chunk);
          cb();
        },
      });
    }
    if (options.stderrLogFunc) {
      stderr = new Writable({
        write(chunk, _, cb) {
          options.stderrLogFunc?.(chunk);
          cb();
        },
      });
    }

    stream?.on('end', () => {
      try {
        stdout.end();
      } catch (e) {}
      try {
        stderr.end();
      } catch (e) {}
    });
    container.modem.demuxStream(stream, stdout, stderr);

    await container.start();

    return Promise.resolve(container);
  }

  return await run(
    'mkdocs',
    [
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
      stdoutLogFunc: options.stdoutLogFunc,
      stderrLogFunc: options.stderrLogFunc,
    },
  );
};
