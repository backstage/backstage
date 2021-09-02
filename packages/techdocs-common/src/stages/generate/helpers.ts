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

import { isChildPath } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { spawn } from 'child_process';
import fs from 'fs-extra';
import gitUrlParse from 'git-url-parse';
import yaml, { DEFAULT_SCHEMA, Type } from 'js-yaml';
import path, { resolve as resolvePath } from 'path';
import { PassThrough, Writable } from 'stream';
import { Logger } from 'winston';
import { ParsedLocationAnnotation } from '../../helpers';
import { SupportedGeneratorKey } from './types';

// TODO: Implement proper support for more generators.
export function getGeneratorKey(entity: Entity): SupportedGeneratorKey {
  if (!entity) {
    throw new Error('No entity provided');
  }

  return 'techdocs';
}

export type RunCommandOptions = {
  command: string;
  args: string[];
  options: object;
  logStream?: Writable;
};

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
 * Return the source url for MkDocs based on the backstage.io/techdocs-ref annotation.
 * Depending on the type of target, it can either return a repo_url, an edit_uri, both, or none.
 *
 * @param {ParsedLocationAnnotation} parsedLocationAnnotation Object with location url and type
 * @param {ScmIntegrationRegistry} scmIntegrations the scmIntegration to do url transformations
 * @param {string} docsFolder the configured docs folder in the mkdocs.yml (defaults to 'docs')
 * @returns the settings for the mkdocs.yml
 */
export const getRepoUrlFromLocationAnnotation = (
  parsedLocationAnnotation: ParsedLocationAnnotation,
  scmIntegrations: ScmIntegrationRegistry,
  docsFolder: string = 'docs',
): { repo_url?: string; edit_uri?: string } => {
  const { type: locationType, target } = parsedLocationAnnotation;

  if (locationType === 'url') {
    const integration = scmIntegrations.byUrl(target);

    // We only support it for github and gitlab for now as the edit_uri
    // is not properly supported for others yet.
    if (integration && ['github', 'gitlab'].includes(integration.type)) {
      // handle the case where a user manually writes url:https://github.com/backstage/backstage i.e. without /blob/...
      const { filepathtype } = gitUrlParse(target);
      if (filepathtype === '') {
        return { repo_url: target };
      }

      const sourceFolder = integration.resolveUrl({
        url: `./${docsFolder}`,
        base: target,
      });
      return { edit_uri: integration.resolveEditUrl(sourceFolder) };
    }
  }

  return {};
};

class UnknownTag {
  constructor(public readonly data: any, public readonly type?: string) {}
}

const MKDOCS_SCHEMA = DEFAULT_SCHEMA.extend([
  new Type('', {
    kind: 'scalar',
    multi: true,
    representName: o => (o as UnknownTag).type,
    represent: o => (o as UnknownTag).data ?? '',
    instanceOf: UnknownTag,
    construct: (data: string, type?: string) => new UnknownTag(data, type),
  }),
]);

/**
 * Finds and loads the contents of either an mkdocs.yml or mkdocs.yaml file,
 * depending on which is present (MkDocs supports both as of v1.2.2).
 *
 * @param {string} inputDir base dir to be searched for either an mkdocs.yml or
 *   mkdocs.yaml file.
 */
export const getMkdocsYml = async (
  inputDir: string,
): Promise<{ path: string; content: string }> => {
  let mkdocsYmlPath: string;
  let mkdocsYmlFileString: string;
  try {
    mkdocsYmlPath = path.join(inputDir, 'mkdocs.yaml');
    mkdocsYmlFileString = await fs.readFile(mkdocsYmlPath, 'utf8');
  } catch {
    try {
      mkdocsYmlPath = path.join(inputDir, 'mkdocs.yml');
      mkdocsYmlFileString = await fs.readFile(mkdocsYmlPath, 'utf8');
    } catch (error) {
      throw new Error(
        `Could not read MkDocs YAML config file mkdocs.yml or mkdocs.yaml for validation: ${error.message}`,
      );
    }
  }

  return {
    path: mkdocsYmlPath,
    content: mkdocsYmlFileString,
  };
};

/**
 * Validating mkdocs config file for incorrect/insecure values
 * Throws on invalid configs
 *
 * @param {string} inputDir base dir to be used as a docs_dir path validity check
 * @param {string} mkdocsYmlFileString The string contents of the loaded
 *   mkdocs.yml or equivalent of a docs site
 */
export const validateMkdocsYaml = async (
  inputDir: string,
  mkdocsYmlFileString: string,
) => {
  const mkdocsYml: any = yaml.load(mkdocsYmlFileString, {
    schema: MKDOCS_SCHEMA,
  });

  if (
    mkdocsYml.docs_dir &&
    !isChildPath(inputDir, resolvePath(inputDir, mkdocsYml.docs_dir))
  ) {
    throw new Error(
      `docs_dir configuration value in mkdocs can't be an absolute directory or start with ../ for security reasons.
       Use relative paths instead which are resolved relative to your mkdocs.yml file location.`,
    );
  }
};

/**
 * Update the mkdocs.yml file before TechDocs generator uses it to generate docs site.
 *
 * List of tasks:
 * - Add repo_url or edit_uri if it does not exists
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
 * @param {ScmIntegrationRegistry} scmIntegrations the scmIntegration to do url transformations
 */
export const patchMkdocsYmlPreBuild = async (
  mkdocsYmlPath: string,
  logger: Logger,
  parsedLocationAnnotation: ParsedLocationAnnotation,
  scmIntegrations: ScmIntegrationRegistry,
) => {
  // We only want to override the mkdocs.yml if it has actually changed. This is relevant if
  // used with a 'dir' location on the file system as this would permanently update the file.
  let didEdit = false;

  let mkdocsYmlFileString;
  try {
    mkdocsYmlFileString = await fs.readFile(mkdocsYmlPath, 'utf8');
  } catch (error) {
    logger.warn(
      `Could not read MkDocs YAML config file ${mkdocsYmlPath} before running the generator: ${error.message}`,
    );
    return;
  }

  let mkdocsYml: any;
  try {
    mkdocsYml = yaml.load(mkdocsYmlFileString, { schema: MKDOCS_SCHEMA });

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

  // Add edit_uri and/or repo_url to mkdocs.yml if it is missing.
  // This will enable the Page edit button generated by MkDocs.
  // If the either has been set, keep the original value
  if (!('repo_url' in mkdocsYml) && !('edit_uri' in mkdocsYml)) {
    const result = getRepoUrlFromLocationAnnotation(
      parsedLocationAnnotation,
      scmIntegrations,
      mkdocsYml.docs_dir,
    );

    if (result.repo_url || result.edit_uri) {
      mkdocsYml.repo_url = result.repo_url;
      mkdocsYml.edit_uri = result.edit_uri;
      didEdit = true;

      logger.info(
        `Set ${JSON.stringify(
          result,
        )}. You can disable this feature by manually setting 'repo_url' or 'edit_uri' according to the MkDocs documentation at https://www.mkdocs.org/user-guide/configuration/#repo_url`,
      );
    }
  }

  try {
    if (didEdit) {
      await fs.writeFile(
        mkdocsYmlPath,
        yaml.dump(mkdocsYml, { schema: MKDOCS_SCHEMA }),
        'utf8',
      );
    }
  } catch (error) {
    logger.warn(
      `Could not write to ${mkdocsYmlPath} after updating it before running the generator. ${error.message}`,
    );
    return;
  }
};

/**
 * Update docs/index.md file before TechDocs generator uses it to generate docs site,
 * falling back to docs/README.md or README.md in case a default docs/index.md
 * is not provided.
 */
export const patchIndexPreBuild = async ({
  inputDir,
  logger,
}: {
  inputDir: string;
  logger: Logger;
}) => {
  const docsPath = path.join(inputDir, 'docs');
  const indexMdPath = path.join(docsPath, 'index.md');

  try {
    await fs.promises.access(indexMdPath);
    return;
  } catch {
    logger.warn('docs/index.md not found.');
  }
  const fallbacks = [
    path.join(docsPath, 'README.md'),
    path.join(inputDir, 'README.md'),
  ];

  await fs.promises.mkdir(docsPath, { recursive: true });
  for (const filePath of fallbacks) {
    try {
      await fs.copyFile(filePath, indexMdPath);
      return;
    } catch (error) {
      logger.warn(`${path.relative(inputDir, filePath)} not found.`);
    }
  }
  logger.warn(
    `Could not find any techdocs' index file. Please make sure at least one of docs/index.md docs/README.md README.md exists.`,
  );
};

/**
 * Update the techdocs_metadata.json to add a new build timestamp metadata. Create the .json file if it doesn't exist.
 *
 * @param {string} techdocsMetadataPath File path to techdocs_metadata.json
 */
export const addBuildTimestampMetadata = async (
  techdocsMetadataPath: string,
  logger: Logger,
): Promise<void> => {
  // check if file exists, create if it does not.
  try {
    await fs.access(techdocsMetadataPath, fs.constants.F_OK);
  } catch (err) {
    // Bootstrap file with empty JSON
    await fs.writeJson(techdocsMetadataPath, JSON.parse('{}'));
  }
  // check if valid Json
  let json;
  try {
    json = await fs.readJson(techdocsMetadataPath);
  } catch (err) {
    const message = `Invalid JSON at ${techdocsMetadataPath} with error ${err.message}`;
    logger.error(message);
    throw new Error(message);
  }

  json.build_timestamp = Date.now();
  await fs.writeJson(techdocsMetadataPath, json);
  return;
};

/**
 * Update the techdocs_metadata.json to add etag of the prepared tree (e.g. commit SHA or actual Etag of the resource).
 * This is helpful to check if a TechDocs site in storage has gone outdated, without maintaining an in-memory build info
 * per Backstage instance.
 *
 * @param {string} techdocsMetadataPath File path to techdocs_metadata.json
 * @param {string} etag
 */
export const storeEtagMetadata = async (
  techdocsMetadataPath: string,
  etag: string,
): Promise<void> => {
  const json = await fs.readJson(techdocsMetadataPath);
  json.etag = etag;
  await fs.writeJson(techdocsMetadataPath, json);
};
