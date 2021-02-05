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

import { NotFoundError, UrlReader } from '@backstage/backend-common';
import { Entity, LocationSpec } from '@backstage/catalog-model';
import * as codeowners from 'codeowners-utils';
import { CodeOwnersEntry } from 'codeowners-utils';
// NOTE: This can be removed when ES2021 is implemented
import 'core-js/features/promise';
import parseGitUrl from 'git-url-parse';
import { filter, get, head, pipe, reverse } from 'lodash/fp';
import { Logger } from 'winston';
import { CatalogProcessor } from './types';

const ALLOWED_LOCATION_TYPES = [
  'url',
  'azure/api',
  'bitbucket/api',
  'github',
  'github/api',
  'gitlab',
  'gitlab/api',
];

// TODO(Rugvip): We want to properly detect out repo provider, but for now it's
//               best to wait for GitHub Apps to be properly introduced and see
//               what kind of APIs that integrations will expose.
const KNOWN_LOCATIONS = ['', '/docs', '/.bitbucket', '/.github', '/.gitlab'];

type Options = {
  reader: UrlReader;
  logger: Logger;
};

export class CodeOwnersProcessor implements CatalogProcessor {
  constructor(private readonly options: Options) {}

  async preProcessEntity(
    entity: Entity,
    location: LocationSpec,
  ): Promise<Entity> {
    // Only continue if the owner is not set
    if (
      !entity ||
      !['Component', 'API'].includes(entity.kind) ||
      !ALLOWED_LOCATION_TYPES.includes(location.type) ||
      (entity.spec && entity.spec.owner)
    ) {
      return entity;
    }

    const owner = await resolveCodeOwner(location, this.options);
    if (!owner) {
      return entity;
    }

    return {
      ...entity,
      spec: { ...entity.spec, owner },
    };
  }
}

export async function resolveCodeOwner(
  location: LocationSpec,
  options: Options,
): Promise<string | undefined> {
  const ownersText = await findRawCodeOwners(location, options);
  if (!ownersText) {
    return undefined;
  }

  const owners = parseCodeOwners(ownersText);

  return findPrimaryCodeOwner(owners);
}

export async function findRawCodeOwners(
  location: LocationSpec,
  options: Options,
): Promise<string | undefined> {
  const readOwnerLocation = async (basePath: string): Promise<string> => {
    const ownerUrl = buildCodeOwnerUrl(
      location.target,
      `${basePath}/CODEOWNERS`,
    );
    const data = await options.reader.read(ownerUrl);
    return data.toString();
  };

  const candidates = KNOWN_LOCATIONS.map(readOwnerLocation);
  return Promise.any(candidates).catch((aggregateError: AggregateError) => {
    const hardError = aggregateError.errors.find(
      error => !(error instanceof NotFoundError),
    );
    if (hardError) {
      options.logger.warn(
        `Failed to read codeowners for location ${location.type}:${location.target}, ${hardError}`,
      );
    } else {
      options.logger.debug(
        `Failed to find codeowners for location ${location.type}:${location.target}`,
      );
    }
    return undefined;
  });
}

export function buildCodeOwnerUrl(
  basePath: string,
  codeOwnersPath: string,
): string {
  return buildUrl({ ...parseGitUrl(basePath), codeOwnersPath });
}

export function parseCodeOwners(ownersText: string) {
  return codeowners.parse(ownersText);
}

export function findPrimaryCodeOwner(
  owners: CodeOwnersEntry[],
): string | undefined {
  return pipe(
    filter((e: CodeOwnersEntry) => e.pattern === '*'),
    reverse,
    head,
    get('owners'),
    head,
    normalizeCodeOwner,
  )(owners);
}

export function normalizeCodeOwner(owner: string) {
  if (owner.match(/^@.*\/.*/)) {
    return owner.split('/')[1];
  } else if (owner.match(/^@.*/)) {
    return owner.substring(1);
  } else if (owner.match(/^.*@.*\..*$/)) {
    return owner.split('@')[0];
  }

  return owner;
}

export function buildUrl({
  protocol = 'https',
  source = 'github.com',
  owner,
  name,
  ref = 'master',
  codeOwnersPath = '/CODEOWNERS',
}: {
  protocol?: string;
  source?: string;
  owner: string;
  name: string;
  ref?: string;
  codeOwnersPath?: string;
}) {
  switch (source) {
    case 'dev.azure.com':
    case 'azure.com':
      throw Error('Azure codeowner url builder not implemented');
    default:
      return `${protocol}://${source}/${owner}/${name}/blob/${ref}${codeOwnersPath}`;
  }
}
