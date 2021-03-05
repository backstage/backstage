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

import Docker from 'dockerode';
import fs from 'fs';
import { PassThrough, Writable } from 'stream';

export type UserOptions = {
  User?: string;
};

export type RunDockerContainerOptions = {
  imageName: string;
  args: string[];
  logStream?: Writable;
  inputDir: string;
  outputDir: string;
  dockerClient: Docker;
  createOptions?: Docker.ContainerCreateOptions;
};

/**
 *
 * @param options the options object
 * @param options.imageName the image to run
 * @param options.args the arguments to pass the container
 * @param options.logStream the log streamer to capture log messages
 * @param options.inputDir the /input path inside the container
 * @param options.outputDir the /output path inside the container
 * @param options.dockerClient the dockerClient to use
 */
export const runDockerContainer = async ({
  imageName,
  args,
  logStream = new PassThrough(),
  inputDir,
  outputDir,
  dockerClient,
  createOptions = {},
}: RunDockerContainerOptions) => {
  // Show a better error message when Docker is unavailable.
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

  const userOptions: UserOptions = {};
  if (process.getuid && process.getgid) {
    // Files that are created inside the Docker container will be owned by
    // root on the host system on non Mac systems, because of reasons. Mainly the fact that
    // volume sharing is done using NFS on Mac and actual mounts in Linux world.
    // So we set the user in the container as the same user and group id as the host.
    // On Windows we don't have process.getuid nor process.getgid
    userOptions.User = `${process.getuid()}:${process.getgid()}`;
  }

  const [{ Error: error, StatusCode: statusCode }] = await dockerClient.run(
    imageName,
    args,
    logStream,
    {
      Volumes: { '/output': {}, '/input': {} },
      WorkingDir: '/input',
      HostConfig: {
        Binds: [
          // Need to use realpath here as Docker mounting does not like
          // symlinks for binding volumes
          `${await fs.promises.realpath(outputDir)}:/output`,
          `${await fs.promises.realpath(inputDir)}:/input`,
        ],
      },
      ...userOptions,
      // Set the home directory inside the container as something that applications can
      // write to, otherwise they will just flop and fail trying to write to /
      Env: ['HOME=/tmp'],
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
};
