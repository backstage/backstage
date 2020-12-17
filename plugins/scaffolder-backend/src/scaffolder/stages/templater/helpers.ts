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
import { Writable, PassThrough } from 'stream';
import Docker from 'dockerode';
import fs from 'fs';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { InputError } from '@backstage/backend-common';
import { spawn } from 'child_process';

export type RunDockerContainerOptions = {
  imageName: string;
  args: string[];
  logStream?: Writable;
  resultDir: string;
  templateDir: string;
  dockerClient: Docker;
  createOptions?: Docker.ContainerCreateOptions;
};

export type RunCommandOptions = {
  command: string;
  args: string[];
  logStream?: Writable;
};

export type UserOptions = {
  User?: string;
};

/**
 * Gets the templater key to use for templating from the entity
 * @param entity Template entity
 */
export const getTemplaterKey = (entity: TemplateEntityV1alpha1): string => {
  const { templater } = entity.spec;

  if (!templater) {
    throw new InputError('Template does not have a required templating key');
  }

  return templater;
};

/**
 *
 * @param options the options object
 * @param options.command the command to run
 * @param options.args the arguments to pass the command
 * @param options.logStream the log streamer to capture log messages
 */
export const runCommand = async ({
  command,
  args,
  logStream = new PassThrough(),
}: RunCommandOptions) => {
  await new Promise<void>((resolve, reject) => {
    const process = spawn(command, args);

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

/**
 *
 * @param options the options object
 * @param options.imageName the image to run
 * @param options.args the arguments to pass the container
 * @param options.logStream the log streamer to capture log messages
 * @param options.resultDir the /result path inside the container
 * @param options.templateDir the /template path inside the container
 * @param options.dockerClient the dockerClient to use
 */
export const runDockerContainer = async ({
  imageName,
  args,
  logStream = new PassThrough(),
  resultDir,
  templateDir,
  dockerClient,
  createOptions = {},
}: RunDockerContainerOptions) => {
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
  // @ts-ignore
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
      Volumes: { '/result': {}, '/template': {} },
      HostConfig: {
        Binds: [
          // Need to use realpath here as Docker mounting does not like
          // symlinks for binding volumes
          `${await fs.promises.realpath(resultDir)}:/result`,
          `${await fs.promises.realpath(templateDir)}:/template`,
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
