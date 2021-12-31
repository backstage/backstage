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

import { Entity } from '@backstage/catalog-model';
import {
  AZURE_DEVOPS_DEFINITION_ANNOTATION,
  AZURE_DEVOPS_REPO_ANNOTATION,
} from '../constants';

export function useAnnotationFromEntity(entity: Entity): {
  project: string;
  repo?: string;
  definition?: string;
} {
  if (entity.metadata.annotations?.[AZURE_DEVOPS_DEFINITION_ANNOTATION]) {
    const { project, definition } = getProjectDefinition(
      entity.metadata.annotations?.[AZURE_DEVOPS_DEFINITION_ANNOTATION],
    );
    const repo = undefined;
    return { project, repo, definition };
  }

  const { project, repo } = getProjectRepo(
    entity.metadata.annotations?.[AZURE_DEVOPS_REPO_ANNOTATION] ?? '',
  );
  const definition = undefined;
  return { project, repo, definition };
}

function getProjectDefinition(annotation: string): {
  project: string;
  definition: string;
} {
  const [project, definition] = annotation.split('/');

  if (!project && !definition) {
    throw new Error(
      'Value for annotation dev.azure.com/project-definition was not in the correct format: <project-name>/<definition-name>',
    );
  }

  if (!project) {
    throw new Error(
      'Project Name for annotation dev.azure.com/project-definition was not found; expected format is: <project-name>/<definition-name>',
    );
  }

  if (!definition) {
    throw new Error(
      'Definition Name for annotation dev.azure.com/project-definition was not found; expected format is: <project-name>/<definition-name>',
    );
  }

  return { project, definition };
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

  if (!project) {
    throw new Error(
      'Project Name for annotation dev.azure.com/project-repo was not found; expected format is: <project-name>/<repo-name>',
    );
  }

  if (!repo) {
    throw new Error(
      'Repo Name for annotation dev.azure.com/project-repo was not found; expected format is: <project-name>/<repo-name>',
    );
  }

  return { project, repo };
}
