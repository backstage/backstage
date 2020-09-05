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
import { InputError } from '@backstage/backend-common';
import { RemoteProtocol } from './types';
import parseGitUrl from 'git-url-parse';
import { Clone, Repository } from 'nodegit';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

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

  // split on the first colon for the protocol and the rest after the first split
  // is the location.
  const [type, target] = annotation.split(/:(.+)/) as [
    RemoteProtocol?,
    string?,
  ];

  if (!type || !target) {
    throw new InputError(
      `Failure to parse either protocol or location for entity: ${entity.metadata.name}`,
    );
  }

  return {
    type,
    target,
  };
};

export const clearGithubRepositoryCache = () => {
  fs.removeSync(path.join(fs.realpathSync(os.tmpdir()), 'backstage-repo'));
};

export const checkoutGitRepository = async (
  repoUrl: string,
): Promise<string> => {
  const parsedGitLocation = parseGitUrl(repoUrl);

  const repositoryTmpPath = path.join(
    // fs.realpathSync fixes a problem with macOS returning a path that is a symlink
    fs.realpathSync(os.tmpdir()),
    'backstage-repo',
    parsedGitLocation.source,
    parsedGitLocation.owner,
    parsedGitLocation.name,
    parsedGitLocation.ref,
  );

  if (fs.existsSync(repositoryTmpPath)) {
    const repository = await Repository.open(repositoryTmpPath);
    const currentBranchName = (await repository.getCurrentBranch()).shorthand();
    await repository.mergeBranches(
      currentBranchName,
      `origin/${currentBranchName}`,
    );
    return repositoryTmpPath;
  }

  const repositoryCheckoutUrl = parsedGitLocation.toString('https');

  fs.mkdirSync(repositoryTmpPath, { recursive: true });
  await Clone.clone(repositoryCheckoutUrl, repositoryTmpPath, {});

  return repositoryTmpPath;
};

// Could be merged with checkoutGitRepository
export const checkoutGithubRepository = async (
  repoUrl: string,
): Promise<string> => {
  const parsedGitLocation = parseGitUrl(repoUrl);

  // Should propably not be hardcoded names of env variables, but seems too hard to access config down here
  const user = process.env.GITHUB_PRIVATE_TOKEN_USER || '';
  const token = process.env.GITHUB_PRIVATE_TOKEN || '';

  const repositoryTmpPath = path.join(
    // fs.realpathSync fixes a problem with macOS returning a path that is a symlink
    fs.realpathSync(os.tmpdir()),
    'backstage-repo',
    parsedGitLocation.source,
    parsedGitLocation.owner,
    parsedGitLocation.name,
    parsedGitLocation.ref,
  );

  if (fs.existsSync(repositoryTmpPath)) {
    const repository = await Repository.open(repositoryTmpPath);
    const currentBranchName = (await repository.getCurrentBranch()).shorthand();
    await repository.mergeBranches(
      currentBranchName,
      `origin/${currentBranchName}`,
    );
    return repositoryTmpPath;
  }

  if (user && token) {
    parsedGitLocation.token = `${user}:${token}`;
  }

  const repositoryCheckoutUrl = parsedGitLocation.toString('https');

  fs.mkdirSync(repositoryTmpPath, { recursive: true });
  await Clone.clone(repositoryCheckoutUrl, repositoryTmpPath);

  return repositoryTmpPath;
};
