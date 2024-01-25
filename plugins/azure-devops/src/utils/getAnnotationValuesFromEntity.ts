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
  AZURE_DEVOPS_PROJECT_ANNOTATION,
  AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION,
  AZURE_DEVOPS_REPO_ANNOTATION,
  AZURE_DEVOPS_HOST_ORG_ANNOTATION,
} from '@backstage/plugin-azure-devops-common';

export function getAnnotationValuesFromEntity(entity: Entity): {
  project: string;
  repo?: string;
  definition?: string;
  host?: string;
  org?: string;
} {
  const hostOrg = getHostOrg(entity.metadata.annotations);
  const projectRepo = getProjectRepo(entity.metadata.annotations);
  const project =
    entity.metadata.annotations?.[AZURE_DEVOPS_PROJECT_ANNOTATION];
  const definition =
    entity.metadata.annotations?.[AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION];

  if (definition) {
    if (project) {
      return {
        project,
        definition,
        ...hostOrg,
      };
    }
    if (projectRepo.project) {
      return {
        project: projectRepo.project,
        repo: projectRepo.repo,
        definition,
        ...hostOrg,
      };
    }
    throw new Error(
      `Value for annotation "${AZURE_DEVOPS_PROJECT_ANNOTATION}" was not found`,
    );
  } else {
    if (projectRepo.project) {
      return {
        project: projectRepo.project,
        repo: projectRepo.repo,
        ...hostOrg,
      };
    }

    if (project) {
      throw new Error(
        `Value for annotation "${AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION}" was not found`,
      );
    }
  }

  throw new Error('Expected "dev.azure.com" annotations were not found');
}

function getProjectRepo(annotations?: Record<string, string>): {
  project?: string;
  repo?: string;
} {
  const annotation = annotations?.[AZURE_DEVOPS_REPO_ANNOTATION];
  if (!annotation) {
    return { project: undefined, repo: undefined };
  }

  if (annotation.split('/').length === 2) {
    const [project, repo] = annotation.split('/');
    if (project && repo) {
      return { project, repo };
    }
  }

  throw new Error(
    `Invalid value for annotation "${AZURE_DEVOPS_REPO_ANNOTATION}"; expected format is: <project-name>/<repo-name>, found: "${annotation}"`,
  );
}

function getHostOrg(annotations?: Record<string, string>): {
  host?: string;
  org?: string;
} {
  const annotation = annotations?.[AZURE_DEVOPS_HOST_ORG_ANNOTATION];
  if (!annotation) {
    return { host: undefined, org: undefined };
  }

  const segments = annotation.split('/');
  if (segments.length === 2) {
    const [host, org] = segments;
    if (host && org) {
      return { host, org };
    }
  } else if (segments.length === 3) {
    const [host, subpath, org] = segments;
    return { host: `${host}/${subpath}`, org };
  }

  throw new Error(
    `Invalid value for annotation "${AZURE_DEVOPS_HOST_ORG_ANNOTATION}"; expected format is: <host-name>/<organization-name>, found: "${annotation}"`,
  );
}
