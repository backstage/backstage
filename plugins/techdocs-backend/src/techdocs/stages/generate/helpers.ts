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

import { Entity } from '@backstage/catalog-model';
import { Writable, PassThrough } from 'stream';
import Docker from 'dockerode';
import { SupportedGeneratorKey } from './types';
import { spawn } from 'child_process';

// TODO: Implement proper support for more generators.
export function getGeneratorKey(entity: Entity): SupportedGeneratorKey {
  if (!entity) {
    throw new Error('No entity provided');
  }

  return 'techdocs';
}

type RunDockerContainerOptions = {
  imageName: string;
  args: string[];
  logStream?: Writable;
  docsDir: string;
  resultDir: string;
  dockerClient: Docker;
  createOptions?: Docker.ContainerCreateOptions;
};

export type RunCommandOptions = {
  command: string;
  args: string[];
  options: object;
  logStream?: Writable;
};

export async function runDockerContainer({
  imageName,
  args,
  logStream = new PassThrough(),
  docsDir,
  resultDir,
  dockerClient,
  createOptions,
}: RunDockerContainerOptions) {
  try {
    await dockerClient.ping();
  } catch (e) {
    throw new Error(
      `This operation requires Docker. Docker does not appear to be available. Docker.ping() failed with: ${e.message}`,
    );
  }

  await new Promise<void>((resolve, reject) => {
    dockerClient.pull(imageName, {}, (err, stream) => {
      if (err) return reject(err);
      stream.pipe(logStream, { end: false });
      stream.on('end', () => resolve());
      stream.on('error', (error: Error) => reject(error));
      return undefined;
    });
  });

  const [{ Error: error, StatusCode: statusCode }] = await dockerClient.run(
    imageName,
    args,
    logStream,
    {
      Volumes: {
        '/content': {},
        '/result': {},
      },
      WorkingDir: '/content',
      HostConfig: {
        Binds: [`${docsDir}:/content`, `${resultDir}:/result`],
      },
      ...createOptions,
    },
  );

  if (error) {
    throw new Error(
      `Docker failed to run with the following error message: ${error}`,
    );
  }

  if (statusCode !== 0) {
    throw new Error(
      `Docker container returned a non-zero exit code (${statusCode})`,
    );
  }

  return { error, statusCode };
}

/**
 *
 * @param options the options object
 * @param options.command the command to run
 * @param options.args the arguments to pass the command
 * @param options.options options used in spawn
 * @param options.logStream the log streamer to capture log messages
 */
export const runCommand = async ({
  command,
  args,
  options,
  logStream = new PassThrough(),
}: RunCommandOptions) => {
  await new Promise<void>((resolve, reject) => {
    const process = spawn(command, args, options);

    process.stdout.on('data', stream => {
      logStream.write(stream);
    });

    process.stderr.on('data', stream => {
      logStream.write(stream);
    });

    process.on('error', error => {
      return reject(error);
    });

    process.on('close', code => {
      if (code !== 0) {
        return reject(`Command ${command} failed, exit code: ${code}`);
      }
      return resolve();
    });
  });
};
