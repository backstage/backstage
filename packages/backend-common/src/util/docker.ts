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
import fs from 'fs-extra';
import { PassThrough, Writable } from 'stream';

export type UserOptions = {
  User?: string;
};

export type RunDockerContainerOptions = {
  imageName: string;
  args: string[];
  logStream?: Writable;
  dockerClient: Docker;
  mountDirs?: Record<string, string>;
  workingDir?: string;
  envVars?: Record<string, string>;
  createOptions?: Docker.ContainerCreateOptions;
};

/**
 *
 * @param options the options object
 * @param options.imageName the image to run
 * @param options.args the arguments to pass the container
 * @param options.logStream the log streamer to capture log messages
 * @param options.dockerClient the dockerClient to use
 * @param options.mountDirs A map of host directories to mount on the container.
 *        Object Key: Path on host machine, Value: Path on Docker container
 * @param options.workingDir Working dir in the container
 * @param options.envVars Environment variables to set in the container. e.g. {'HOME': '/tmp'}
 */
export const runDockerContainer = async ({
  imageName,
  args,
  logStream = new PassThrough(),
  dockerClient,
  mountDirs = {},
  workingDir,
  envVars = {},
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

  // Initialize volumes to mount based on mountDirs map
  const Volumes: { [T: string]: object } = {};
  for (const containerDir of Object.values(mountDirs)) {
    Volumes[containerDir] = {};
  }

  // Create bind volumes
  const Binds: string[] = [];
  for (const [hostDir, containerDir] of Object.entries(mountDirs)) {
    // Need to use realpath here as Docker mounting does not like
    // symlinks for binding volumes
    const realHostDir = await fs.realpath(hostDir);
    Binds.push(`${realHostDir}:${containerDir}`);
  }

  // Create docker environment variables array
  const Env = [];
  for (const [key, value] of Object.entries(envVars)) {
    Env.push(`${key}=${value}`);
  }

  const [{ Error: error, StatusCode: statusCode }] = await dockerClient.run(
    imageName,
    args,
    logStream,
    {
      Volumes,
      HostConfig: {
        Binds,
      },
      ...(workingDir ? { WorkingDir: workingDir } : {}),
      Env,
      ...userOptions,
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
