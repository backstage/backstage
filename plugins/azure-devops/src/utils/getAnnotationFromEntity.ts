/*
 * Copyright 2021 The Backstage Authors
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
  AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION,
  AZURE_DEVOPS_PROJECT_ANNOTATION,
  AZURE_DEVOPS_REPO_ANNOTATION,
} from '../constants';

import { Entity } from '@backstage/catalog-model';

export function getAnnotationFromEntity(entity: Entity): {
  project: string;
  repo?: string;
  definition?: string;
} {
  const annotation =
    entity.metadata.annotations?.[AZURE_DEVOPS_REPO_ANNOTATION];
  if (annotation) {
    const { project, repo } = getProjectRepo(annotation);
    const definition = undefined;
    return { project, repo, definition };
  }

  const project =
    entity.metadata.annotations?.[AZURE_DEVOPS_PROJECT_ANNOTATION];
  if (!project) {
    throw new Error('Value for annotation dev.azure.com/project was not found');
  }

  const definition =
    entity.metadata.annotations?.[AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION];
  if (!definition) {
    throw new Error(
      'Value for annotation dev.azure.com/build-definition was not found',
    );
  }

  const repo = undefined;
  return { project, repo, definition };
}

function getProjectRepo(annotation: string): {
  project: string;
  repo: string;
} {
  const [project, repo] = annotation.split('/');

  if (!project && !repo) {
    throw new Error(
      'Value for annotation dev.azure.com/project-repo was not in the correct format: <project-name>/<repo-name>',
    );
  }

  return { project, repo };
}
