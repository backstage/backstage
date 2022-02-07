/*
 * Copyright 2022 The Backstage Authors
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

import { NotFoundError, InputError } from '@backstage/errors';
import { Entity, SOURCE_LOCATION_ANNOTATION } from '@backstage/catalog-model';
import { OwnerRepo } from './types';

export function getEntitySourceLocationInfo(
  entity: Entity,
): { url: URL } & OwnerRepo {
  const source = entity.metadata.annotations?.[SOURCE_LOCATION_ANNOTATION];

  if (!source) {
    throw new NotFoundError(`The entity doesn't have a source url`);
  }

  const sourceUrl = source.startsWith('url:') ? source.slice(4) : source;

  const url = (() => {
    try {
      return new URL(sourceUrl);
    } catch (_err) {
      throw new InputError(`The entity source isn't a valid url: ${sourceUrl}`);
    }
  })();

  const parts = url.pathname.slice(1).split('/');

  if (parts.length < 2) {
    throw new InputError(
      `The entity source url doesn't contain owner/repo: ${sourceUrl}`,
    );
  }

  const owner = parts[0];
  const repo = parts[1].endsWith('.git')
    ? parts[1].slice(0, parts[1].length - 4)
    : parts[1];

  return {
    url,
    owner,
    repo,
  };
}
