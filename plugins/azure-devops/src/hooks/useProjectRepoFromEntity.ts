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
import { AZURE_DEVOPS_ANNOTATION } from '../constants';

export function useProjectRepoFromEntity(entity: Entity): {
  project: string;
  repo: string;
} {
  const [project, repo] = (
    entity.metadata.annotations?.[AZURE_DEVOPS_ANNOTATION] ?? ''
  ).split('/');

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
