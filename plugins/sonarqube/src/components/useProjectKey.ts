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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Entity } from '@backstage/catalog-model';

/** @public */
export const SONARQUBE_PROJECT_KEY_ANNOTATION = 'sonarqube.org/project-key';
export const SONARQUBE_PROJECT_INSTANCE_SEPARATOR = '/';

/** @public */
export const isSonarQubeAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[SONARQUBE_PROJECT_KEY_ANNOTATION]);

/**
 * Try to parse sonarqube information from an entity.
 *
 * If part or all info are not found, they will default to undefined
 *
 * @param entity entity to find the sonarqube information from.
 * @return a ProjectInfo properly populated.
 */
export const useProjectInfo = (
  entity: Entity,
): {
  projectInstance: string | undefined;
  projectKey: string | undefined;
} => {
  let projectInstance = undefined;
  let projectKey = undefined;
  const annotation =
    entity?.metadata.annotations?.[SONARQUBE_PROJECT_KEY_ANNOTATION];
  if (annotation) {
    const instanceSeparatorIndex = annotation.indexOf(
      SONARQUBE_PROJECT_INSTANCE_SEPARATOR,
    );
    if (instanceSeparatorIndex > -1) {
      // Examples:
      //   instanceA/projectA  -> projectInstance = "instanceA" & projectKey = "projectA"
      //   instanceA/tenantA:projectA -> projectInstance = "instanceA" & projectKey = "tenantA:projectA"
      //   instanceA/tenantA/projectA -> projectInstance = "instanceA" & projectKey = "tenantA/projectA"
      projectInstance = annotation.substring(0, instanceSeparatorIndex);
      projectKey = annotation.substring(instanceSeparatorIndex + 1);
    } else {
      projectKey = annotation;
    }
  }
  return { projectInstance, projectKey };
};
