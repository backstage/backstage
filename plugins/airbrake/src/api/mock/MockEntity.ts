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
import { AIRBRAKE_PROJECT_ID_ANNOTATION } from '../../components/useProjectId';
import { Entity } from '@backstage/catalog-model';

export const createEntity = (projectId?: number) => {
  const projectIdString = projectId?.toString();

  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        [AIRBRAKE_PROJECT_ID_ANNOTATION]: projectIdString,
      },
      name: projectIdString,
    },
  } as Entity;
};
