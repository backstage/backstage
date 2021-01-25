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

import fs from 'fs-extra';
import { spawn } from 'child_process';
import { Writable, PassThrough } from 'stream';
import Docker from 'dockerode';
import yaml from 'js-yaml';
import { Logger } from 'winston';
import { Entity } from '@backstage/catalog-model';
import { SupportedGeneratorKey } from './types';
import { ParsedLocationAnnotation } from '../../helpers';
import { RemoteProtocol } from '../prepare/types';

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
  outputDir: string;
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
  outputDir,
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
        Binds: [`${docsDir}:/content`, `${outputDir}:/result`],
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

/**
 * Return true if mkdocs can compile docs with provided repo_url
 *
 * Valid repo_url examples in mkdocs.yml
 * - https://github.com/backstage/backstage
 * - https://gitlab.com/org/repo/
 * - http://github.com/backstage/backstage
 * - A http(s) protocol URL to the root of the repository
 *
 * Invalid repo_url examples in mkdocs.yml
 * - https://github.com/backstage/backstage/blob/master/plugins/techdocs-backend/examples/documented-component
 * - (anything that is not valid as described above)
 *
 * @param {string} repoUrl URL supposed to be used as repo_url in mkdocs.yml
 * @param {RemoteProtocol} locationType Type of source code host - github, gitlab, dir, url, etc.
 * @returns {boolean}
 */
export const isValidRepoUrlForMkdocs = (
  repoUrl: string,
  locationType: RemoteProtocol,
): boolean => {
  // Trim trailing slash
  const cleanRepoUrl = repoUrl.replace(/\/$/, '');

  if (locationType === 'github' || locationType === 'gitlab') {
    // A valid repoUrl to the root of the repository will be split into 5 strings if split using the / delimiter.
    // We do not want URLs which have more than that number of forward slashes since they will signify a non-root location
    // Note: This is not the best possible implementation but will work most of the times.. Feel free to improve or
    // highlight edge cases.
    return cleanRepoUrl.split('/').length === 5;
  }

  return false;
};

/**
 * Return a valid URL of the repository used in backstage.io/techdocs-ref annotation.
 * Return undefined if the `target` is not valid in context of repo_url in mkdocs.yml
 * Alter URL so that it is a valid repo_url config in mkdocs.yml
 *
 * @param {ParsedLocationAnnotation} parsedLocationAnnotation Object with location url and type
 * @returns {string | undefined}
 */
export const getRepoUrlFromLocationAnnotation = (
  parsedLocationAnnotation: ParsedLocationAnnotation,
): string | undefined => {
  const { type: locationType, target } = parsedLocationAnnotation;

  // Add more options from the RemoteProtocol type of parsedLocationAnnotation.type here
  // when TechDocs supports more hosts and if mkdocs can generated an Edit URL for them.
  const supportedHosts = ['github', 'gitlab'];

  if (supportedHosts.includes(locationType)) {
    // Trim .git or .git/ from the end of repository url
    return target.replace(/.git\/*$/, '');
  }

  return undefined;
};

/**
 * Update the mkdocs.yml file before TechDocs generator uses it to generate docs site.
 *
 * List of tasks:
 * - Add repo_url if it does not exists
 * If mkdocs.yml has a repo_url, the generated docs site gets an Edit button on the pages by default.
 * If repo_url is missing in mkdocs.yml, we will use techdocs annotation of the entity to possibly get
 * the repository URL.
 *
 * This function will not throw an error since this is not critical to the whole TechDocs pipeline.
 * Instead it will log warnings if there are any errors in reading, parsing or writing YAML.
 *
 * @param {string} mkdocsYmlPath Absolute path to mkdocs.yml or equivalent of a docs site
 * @param {Logger} logger
 * @param {ParsedLocationAnnotation} parsedLocationAnnotation Object with location url and type
 */
export const patchMkdocsYmlPreBuild = async (
  mkdocsYmlPath: string,
  logger: Logger,
  parsedLocationAnnotation: ParsedLocationAnnotation,
) => {
  let mkdocsYmlFileString;
  try {
    mkdocsYmlFileString = await fs.readFile(mkdocsYmlPath, 'utf8');
  } catch (error) {
    logger.warn(
      `Could not read file ${mkdocsYmlPath} before running the generator. ${error.message}`,
    );
    return;
  }

  let mkdocsYml: any;
  try {
    mkdocsYml = yaml.load(mkdocsYmlFileString);

    // mkdocsYml should be an object type after successful parsing.
    // But based on its type definition, it can also be a string or undefined, which we don't want.
    if (typeof mkdocsYml === 'string' || typeof mkdocsYml === 'undefined') {
      throw new Error('Bad YAML format.');
    }
  } catch (error) {
    logger.warn(
      `Error in parsing YAML at ${mkdocsYmlPath} before running the generator. ${error.message}`,
    );
    return;
  }

  // Add repo_url to mkdocs.yml if it is missing. This will enable the Page edit button generated by MkDocs.
  if (!('repo_url' in mkdocsYml)) {
    const repoUrl = getRepoUrlFromLocationAnnotation(parsedLocationAnnotation);
    if (repoUrl !== undefined) {
      // mkdocs.yml will not build with invalid repo_url. So, make sure it is valid.
      if (isValidRepoUrlForMkdocs(repoUrl, parsedLocationAnnotation.type)) {
        mkdocsYml.repo_url = repoUrl;
      }
    }
  }

  try {
    await fs.writeFile(mkdocsYmlPath, yaml.dump(mkdocsYml), 'utf8');
  } catch (error) {
    logger.warn(
      `Could not write to ${mkdocsYmlPath} after updating it before running the generator. ${error.message}`,
    );
    return;
  }
};
