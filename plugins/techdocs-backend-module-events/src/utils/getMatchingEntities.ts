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
import { ANNOTATION_SOURCE_LOCATION, Entity } from '@backstage/catalog-model';
import {
  CATALOG_FILTER_EXISTS,
  CatalogApi,
  GetEntitiesRequest,
} from '@backstage/catalog-client';

import { Logger } from 'winston';

import { TokenManager } from '@backstage/backend-common';
import parseGitUrl from 'git-url-parse';
import { TECHDOCS_ANNOTATION } from '../constants';

export async function getMatchingEntities(
  tokenManager: TokenManager,
  catalogClient: CatalogApi,
  logger: Logger,
  projectName: string,
  repoName: string,
): Promise<Entity[]> {
  const matchingEntity: Entity[] = [];
  const request: GetEntitiesRequest = {
    filter: {
      [`metadata.annotations.${TECHDOCS_ANNOTATION}`]: CATALOG_FILTER_EXISTS,
    },
    fields: ['kind', 'metadata'],
  };
  const { token } = await tokenManager.getToken();
  const response = await catalogClient.getEntities(request, { token });
  const entities = response.items;
  if (entities.length === 0) {
    logger.warn(
      `Did not find any entities with the ${TECHDOCS_ANNOTATION} annotation`,
    );
    return matchingEntity;
  }

  for (const entity of entities) {
    const techDocsAnnotationValue =
      entity.metadata.annotations?.[TECHDOCS_ANNOTATION] ?? '';
    let url;
    if (techDocsAnnotationValue.startsWith('dir:')) {
      const sourceLocation =
        entity.metadata.annotations?.[ANNOTATION_SOURCE_LOCATION];
      if (!sourceLocation) {
        // No source location!
        logger.warn(`No source location was found on ${entity.metadata.name}`);
        continue;
      }
      url = (sourceLocation as string).substring(4);
    } else if (techDocsAnnotationValue.startsWith('url:')) {
      url = techDocsAnnotationValue.substring(4);
    } else if (techDocsAnnotationValue.length > 0) {
      url = techDocsAnnotationValue;
    } else {
      // Some how we have no value for the TechDocs annotation!
      logger.warn(
        `No TechDocs annotation value was found on ${entity.metadata.name}`,
      );
      continue;
    }

    const { owner, name } = parseGitUrl(url);

    // TODO(awanlin): This is a bit of a hack to handle Azure DevOps Server on-prem
    // This might be handled in a better way in the main Backstage project?
    let project = owner;
    if (owner.includes('_git')) {
      project = owner.split('/')[1];
    }

    if (
      project.toLowerCase() === projectName.toLowerCase() &&
      name.toLowerCase() === repoName.toLowerCase()
    ) {
      matchingEntity.push(entity);
    }
  }

  return matchingEntity;
}
