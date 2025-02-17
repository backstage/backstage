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

import { isChildPath, LoggerService } from '@backstage/backend-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { assertError, ForwardedError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { SpawnOptionsWithoutStdio, spawn } from 'child_process';
import fs from 'fs-extra';
import gitUrlParse from 'git-url-parse';
import yaml, { DEFAULT_SCHEMA, Type } from 'js-yaml';
import path, { resolve as resolvePath } from 'path';
import { PassThrough, Writable } from 'stream';
import { ParsedLocationAnnotation } from '../../helpers';
import { DefaultMkdocsContent, SupportedGeneratorKey } from './types';
import { getFileTreeRecursively } from '../publish/helpers';

// TODO: Implement proper support for more generators.
export function getGeneratorKey(entity: Entity): SupportedGeneratorKey {
  if (!entity) {
    throw new Error('No entity provided');
  }

  return 'techdocs';
}

export type RunCommandOptions = {
  /** command to run */
  command: string;
  /** arguments to pass the command */
  args: string[];
  /** options to pass to spawn */
  options: SpawnOptionsWithoutStdio;
  /** stream to capture stdout and stderr output */
  logStream?: Writable;
};

/**
 * Run a command in a sub-process, normally a shell command.
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
 * @param parsedLocationAnnotation - Object with location url and type
 * @param scmIntegrations - the scmIntegration to do url transformations
 * @param docsFolder - the configured docs folder in the mkdocs.yml (defaults to 'docs')
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

    // We only support it for github, gitlab, bitbucketServer and harness for now as the edit_uri
    // is not properly supported for others yet.
    if (
      integration &&
      ['github', 'gitlab', 'bitbucketServer', 'harness'].includes(
        integration.type,
      )
    ) {
      // handle the case where a user manually writes url:https://github.com/backstage/backstage i.e. without /blob/...
      const { filepathtype } = gitUrlParse(target);
      if (filepathtype === '') {
        return { repo_url: target };
      }

      const sourceFolder = integration.resolveUrl({
        url: `./${docsFolder}`,
        base: target.endsWith('/') ? target : `${target}/`,
      });
      return {
        repo_url: target,
        edit_uri: integration.resolveEditUrl(sourceFolder),
      };
    }
  }

  return {};
};

class UnknownTag {
  constructor(public readonly data: any, public readonly type?: string) {}
}

export const MKDOCS_SCHEMA = DEFAULT_SCHEMA.extend([
  new Type('', {
    kind: 'scalar',
    multi: true,
    representName: o => (o as UnknownTag).type,
    represent: o => (o as UnknownTag).data ?? '',
    instanceOf: UnknownTag,
    construct: (data: string, type?: string) => new UnknownTag(data, type),
  }),
  new Type('tag:', {
    kind: 'mapping',
    multi: true,
    representName: o => (o as UnknownTag).type,
    represent: o => (o as UnknownTag).data ?? '',
    instanceOf: UnknownTag,
    construct: (data: string, type?: string) => new UnknownTag(data, type),
  }),
  new Type('', {
    kind: 'sequence',
    multi: true,
    representName: o => (o as UnknownTag).type,
    represent: o => (o as UnknownTag).data ?? '',
    instanceOf: UnknownTag,
    construct: (data: string, type?: string) => new UnknownTag(data, type),
  }),
]);

/**
 * Generates a mkdocs.yml configuration file
 *
 * @param inputDir - base dir to where the mkdocs.yml file will be created
 * @param siteOptions - options for the site: `name` property will be used in mkdocs.yml for the
 * required `site_name` property, default value is "Documentation Site"
 */
export const generateMkdocsYml = async (
  inputDir: string,
  siteOptions?: { name?: string },
) => {
  try {
    // TODO(awanlin): Use a provided default mkdocs.yml
    // from config or some specified location. If this is
    // not provided then fall back to generating bare
    // minimum mkdocs.yml file

    const mkdocsYmlPath = path.join(inputDir, 'mkdocs.yml');
    const defaultSiteName = siteOptions?.name ?? 'Documentation Site';
    const defaultMkdocsContent: DefaultMkdocsContent = {
      site_name: defaultSiteName,
      docs_dir: 'docs',
      plugins: ['techdocs-core'],
    };

    await fs.writeFile(
      mkdocsYmlPath,
      yaml.dump(defaultMkdocsContent, { schema: MKDOCS_SCHEMA }),
    );
  } catch (error) {
    throw new ForwardedError('Could not generate mkdocs.yml file', error);
  }
};

/**
 * Finds and loads the contents of an mkdocs.yml, mkdocs.yaml file, a file
 * with a specified name or an ad-hoc created file with minimal config.
 * @public
 *
 * @param inputDir - base dir to be searched for either an mkdocs.yml or mkdocs.yaml file.
 * @param options - name: default mkdocs site_name to be used with a ad hoc file default value is "Documentation Site"
 *                  mkdocsConfigFileName (optional): a non-default file name to be used as the config
 */
export const getMkdocsYml = async (
  inputDir: string,
  options?: { name?: string; mkdocsConfigFileName?: string },
): Promise<{ path: string; content: string; configIsTemporary: boolean }> => {
  let mkdocsYmlPath: string;
  let mkdocsYmlFileString: string;
  try {
    if (options?.mkdocsConfigFileName) {
      mkdocsYmlPath = path.join(inputDir, options.mkdocsConfigFileName);
      if (!(await fs.pathExists(mkdocsYmlPath))) {
        throw new Error(`The specified file ${mkdocsYmlPath} does not exist`);
      }

      mkdocsYmlFileString = await fs.readFile(mkdocsYmlPath, 'utf8');
      return {
        path: mkdocsYmlPath,
        content: mkdocsYmlFileString,
        configIsTemporary: false,
      };
    }

    mkdocsYmlPath = path.join(inputDir, 'mkdocs.yaml');
    if (await fs.pathExists(mkdocsYmlPath)) {
      mkdocsYmlFileString = await fs.readFile(mkdocsYmlPath, 'utf8');
      return {
        path: mkdocsYmlPath,
        content: mkdocsYmlFileString,
        configIsTemporary: false,
      };
    }

    mkdocsYmlPath = path.join(inputDir, 'mkdocs.yml');
    if (await fs.pathExists(mkdocsYmlPath)) {
      mkdocsYmlFileString = await fs.readFile(mkdocsYmlPath, 'utf8');
      return {
        path: mkdocsYmlPath,
        content: mkdocsYmlFileString,
        configIsTemporary: false,
      };
    }

    // No mkdocs file, generate it
    await generateMkdocsYml(inputDir, options);
    mkdocsYmlFileString = await fs.readFile(mkdocsYmlPath, 'utf8');
  } catch (error) {
    throw new ForwardedError(
      'Could not read MkDocs YAML config file mkdocs.yml or mkdocs.yaml or default for validation',
      error,
    );
  }

  return {
    path: mkdocsYmlPath,
    content: mkdocsYmlFileString,
    configIsTemporary: true,
  };
};

/**
 * Validating mkdocs config file for incorrect/insecure values
 * Throws on invalid configs
 *
 * @param inputDir - base dir to be used as a docs_dir path validity check
 * @param mkdocsYmlFileString - The string contents of the loaded
 *   mkdocs.yml or equivalent of a docs site
 * @returns the parsed docs_dir or undefined
 */
export const validateMkdocsYaml = async (
  inputDir: string,
  mkdocsYmlFileString: string,
): Promise<string | undefined> => {
  const mkdocsYml = yaml.load(mkdocsYmlFileString, {
    schema: MKDOCS_SCHEMA,
  });

  if (mkdocsYml === null || typeof mkdocsYml !== 'object') {
    return undefined;
  }

  const parsedMkdocsYml: Record<string, any> = mkdocsYml;
  if (
    parsedMkdocsYml.docs_dir &&
    !isChildPath(inputDir, resolvePath(inputDir, parsedMkdocsYml.docs_dir))
  ) {
    throw new Error(
      `docs_dir configuration value in mkdocs can't be an absolute directory or start with ../ for security reasons.
       Use relative paths instead which are resolved relative to your mkdocs.yml file location.`,
    );
  }
  return parsedMkdocsYml.docs_dir;
};

/**
 * Update docs/index.md file before TechDocs generator uses it to generate docs site,
 * falling back to docs/README.md or README.md in case a default docs/index.md
 * is not provided.
 */
export const patchIndexPreBuild = async ({
  inputDir,
  logger,
  docsDir = 'docs',
}: {
  inputDir: string;
  logger: LoggerService;
  docsDir?: string;
}) => {
  const docsPath = path.join(inputDir, docsDir);
  const indexMdPath = path.join(docsPath, 'index.md');

  if (await fs.pathExists(indexMdPath)) {
    return;
  }
  logger.warn(`${path.join(docsDir, 'index.md')} not found.`);
  const fallbacks = [
    path.join(docsPath, 'README.md'),
    path.join(docsPath, 'readme.md'),
    path.join(inputDir, 'README.md'),
    path.join(inputDir, 'readme.md'),
  ];

  await fs.ensureDir(docsPath);
  for (const filePath of fallbacks) {
    try {
      await fs.copyFile(filePath, indexMdPath);
      return;
    } catch (error) {
      logger.warn(`${path.relative(inputDir, filePath)} not found.`);
    }
  }

  logger.warn(
    `Could not find any techdocs' index file. Please make sure at least one of ${[
      indexMdPath,
      ...fallbacks,
    ].join(' ')} exists.`,
  );
};

/**
 * Create or update the techdocs_metadata.json. Values initialized/updated are:
 * - The build_timestamp (now)
 * - The list of files generated
 *
 * @param techdocsMetadataPath - File path to techdocs_metadata.json
 */
export const createOrUpdateMetadata = async (
  techdocsMetadataPath: string,
  logger: LoggerService,
): Promise<void> => {
  const techdocsMetadataDir = techdocsMetadataPath
    .split(path.sep)
    .slice(0, -1)
    .join(path.sep);
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
    assertError(err);
    const message = `Invalid JSON at ${techdocsMetadataPath} with error ${err.message}`;
    logger.error(message);
    throw new Error(message);
  }

  json.build_timestamp = Date.now();

  // Get and write generated files to the metadata JSON. Each file string is in
  // a form appropriate for invalidating the associated object from cache.
  try {
    json.files = (await getFileTreeRecursively(techdocsMetadataDir)).map(file =>
      file.replace(`${techdocsMetadataDir}${path.sep}`, ''),
    );
  } catch (err) {
    assertError(err);
    json.files = [];
    logger.warn(`Unable to add files list to metadata: ${err.message}`);
  }

  await fs.writeJson(techdocsMetadataPath, json);
  return;
};

/**
 * Update the techdocs_metadata.json to add etag of the prepared tree (e.g. commit SHA or actual Etag of the resource).
 * This is helpful to check if a TechDocs site in storage has gone outdated, without maintaining an in-memory build info
 * per Backstage instance.
 *
 * @param techdocsMetadataPath - File path to techdocs_metadata.json
 * @param etag - The ETag to use
 */
export const storeEtagMetadata = async (
  techdocsMetadataPath: string,
  etag: string,
): Promise<void> => {
  const json = await fs.readJson(techdocsMetadataPath);
  json.etag = etag;
  await fs.writeJson(techdocsMetadataPath, json);
};
