/*
 * Copyright 2023 The Backstage Authors
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

import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
} from '@backstage/catalog-model';
import { merge } from 'lodash';
import {
  ANNOTATION_GITHUB_TEAM_SLUG,
  ANNOTATION_GITHUB_USER_LOGIN,
} from './annotation';
import { splitTeamSlug } from './util';

// Makes sure that emitted entities have a proper location
export function withLocations(
  baseUrl: string,
  org: string,
  entity: Entity,
): Entity {
  const login =
    entity.metadata.annotations?.[ANNOTATION_GITHUB_USER_LOGIN] ||
    entity.metadata.name;

  let team = entity.metadata.name;
  const slug = entity.metadata.annotations?.[ANNOTATION_GITHUB_TEAM_SLUG];
  if (slug) {
    const [_, slugTeam] = splitTeamSlug(slug);
    team = slugTeam;
  }

  const location =
    entity.kind === 'Group'
      ? `url:${baseUrl}/orgs/${org}/teams/${team}`
      : `url:${baseUrl}/${login}`;
  return merge(
    {
      metadata: {
        annotations: {
          [ANNOTATION_LOCATION]: location,
          [ANNOTATION_ORIGIN_LOCATION]: location,
        },
      },
    },
    entity,
  ) as Entity;
}
