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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Git,
  resolveSafeChildPath,
  UrlReader,
} from '@backstage/backend-common';
import {
  Entity,
  getEntitySourceLocation,
  parseLocationReference,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import fs from 'fs-extra';
import parseGitUrl from 'git-url-parse';
import os from 'os';
import path from 'path';
import { Logger } from 'winston';
import { getDefaultBranch } from './default-branch';
import { getGitRepoType, getTokenForGitRepo } from './git-auth';
import { PreparerResponse, RemoteProtocol } from './stages/prepare/types';

export type ParsedLocationAnnotation = {
  type: RemoteProtocol;
  target: string;
};

export const parseReferenceAnnotation = (
  annotationName: string,
  entity: Entity,
): ParsedLocationAnnotation => {
  const annotation = entity.metadata.annotations?.[annotationName];
  if (!annotation) {
    throw new InputError(
      `No location annotation provided in entity: ${entity.metadata.name}`,
    );
  }

  const { type, target } = parseLocationReference(annotation);
  return {
    type: type as RemoteProtocol,
    target,
  };
};

/**
 * TechDocs references of type `dir` are relative the source location of the entity.
 * This function transforms relative references to absolute ones, based on the
 * location the entity was ingested from. If the entity was registered by a `url`
 * location, it returns a `url` location with a resolved target that points to the
 * targeted subfolder. If the entity was registered by a `file` location, it returns
 * an absolute `dir` location.
 *
 * @param entity - the entity with annotations
 * @param dirAnnotation - the parsed techdocs-ref annotation of type 'dir'
 * @param scmIntegrations - access to the scmIntegration to do url transformations
 * @throws if the entity doesn't specify a `dir` location or is ingested from an unsupported location.
 * @returns the transformed location with an absolute target.
 */
export const transformDirLocation = (
  entity: Entity,
  dirAnnotation: ParsedLocationAnnotation,
  scmIntegrations: ScmIntegrationRegistry,
): { type: 'dir' | 'url'; target: string } => {
  const location = getEntitySourceLocation(entity);

  switch (location.type) {
    case 'url': {
      const target = scmIntegrations.resolveUrl({
        url: dirAnnotation.target,
        base: location.target,
      });

      return {
        type: 'url',
        target,
      };
    }

    case 'file': {
      // only permit targets in the same folder as the target of the `file` location!
      const target = resolveSafeChildPath(
        path.dirname(location.target),
        dirAnnotation.target,
      );

      return {
        type: 'dir',
        target,
      };
    }

    default:
      throw new InputError(`Unable to resolve location type ${location.type}`);
  }
};

export const getLocationForEntity = (
  entity: Entity,
  scmIntegration: ScmIntegrationRegistry,
): ParsedLocationAnnotation => {
  const annotation = parseReferenceAnnotation(
    'backstage.io/techdocs-ref',
    entity,
  );

  switch (annotation.type) {
    case 'github':
    case 'gitlab':
    case 'azure/api':
    case 'url':
      return annotation;
    case 'dir':
      return transformDirLocation(entity, annotation, scmIntegration);
    default:
      throw new Error(`Invalid reference annotation ${annotation.type}`);
  }
};

export const getGitRepositoryTempFolder = async (
  repositoryUrl: string,
  config: Config,
): Promise<string> => {
  const parsedGitLocation = parseGitUrl(repositoryUrl);
  // removes .git from git location path
  parsedGitLocation.git_suffix = false;

  if (!parsedGitLocation.ref) {
    parsedGitLocation.ref = await getDefaultBranch(
      parsedGitLocation.toString('https'),
      config,
    );
  }

  return path.join(
    // fs.realpathSync fixes a problem with macOS returning a path that is a symlink
    fs.realpathSync(os.tmpdir()),
    'backstage-repo',
    parsedGitLocation.resource,
    parsedGitLocation.owner,
    parsedGitLocation.name,
    parsedGitLocation.ref,
  );
};

export const checkoutGitRepository = async (
  repoUrl: string,
  config: Config,
  logger: Logger,
): Promise<string> => {
  const parsedGitLocation = parseGitUrl(repoUrl);
  const repositoryTmpPath = await getGitRepositoryTempFolder(repoUrl, config);
  const token = await getTokenForGitRepo(repoUrl, config);

  // Initialize a git client
  let git = Git.fromAuth({ logger });

  // Docs about why username and password are set to these specific values.
  // https://isomorphic-git.org/docs/en/onAuth#oauth2-tokens
  if (token) {
    const type = getGitRepoType(repoUrl);
    switch (type) {
      case 'github':
        git = Git.fromAuth({
          username: 'x-access-token',
          password: token,
          logger,
        });
        parsedGitLocation.token = `x-access-token:${token}`;
        break;
      case 'gitlab':
        git = Git.fromAuth({
          username: 'oauth2',
          password: token,
          logger,
        });
        parsedGitLocation.token = `dummyUsername:${token}`;
        parsedGitLocation.git_suffix = true;
        break;
      case 'azure/api':
        git = Git.fromAuth({
          username: 'notempty',
          password: token,
          logger: logger,
        });
        break;
      default:
        parsedGitLocation.token = `:${token}`;
    }
  }

  // Pull from repository if it has already been cloned.
  if (fs.existsSync(repositoryTmpPath)) {
    try {
      const currentBranchName = await git.currentBranch({
        dir: repositoryTmpPath,
      });

      await git.fetch({ dir: repositoryTmpPath, remote: 'origin' });
      await git.merge({
        dir: repositoryTmpPath,
        theirs: `origin/${currentBranchName}`,
        ours: currentBranchName || undefined,
        author: { name: 'Backstage TechDocs', email: 'techdocs@backstage.io' },
        committer: {
          name: 'Backstage TechDocs',
          email: 'techdocs@backstage.io',
        },
      });
      return repositoryTmpPath;
    } catch (e) {
      logger.info(
        `Found error "${e.message}" in cached repository "${repoUrl}" when getting latest changes. Removing cached repository.`,
      );
      fs.removeSync(repositoryTmpPath);
    }
  }

  const repositoryCheckoutUrl = parsedGitLocation.toString('https');

  fs.mkdirSync(repositoryTmpPath, { recursive: true });
  await git.clone({ url: repositoryCheckoutUrl, dir: repositoryTmpPath });

  return repositoryTmpPath;
};

export const getLastCommitTimestamp = async (
  repositoryLocation: string,
  logger: Logger,
): Promise<number> => {
  const git = Git.fromAuth({ logger });
  const sha = await git.resolveRef({ dir: repositoryLocation, ref: 'HEAD' });
  const commit = await git.readCommit({ dir: repositoryLocation, sha });

  return commit.commit.committer.timestamp;
};

export const getDocFilesFromRepository = async (
  reader: UrlReader,
  entity: Entity,
  opts?: { etag?: string; logger?: Logger },
): Promise<PreparerResponse> => {
  const { target } = parseReferenceAnnotation(
    'backstage.io/techdocs-ref',
    entity,
  );

  opts?.logger?.debug(`Reading files from ${target}`);
  // readTree will throw NotModifiedError if etag has not changed.
  const readTreeResponse = await reader.readTree(target, { etag: opts?.etag });
  const preparedDir = await readTreeResponse.dir();

  opts?.logger?.debug(`Tree downloaded and stored at ${preparedDir}`);

  return {
    preparedDir,
    etag: readTreeResponse.etag,
  };
};
