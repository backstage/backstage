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

import { ComponentEntityV1alpha1, Entity } from '@backstage/catalog-model';
import { PermissionCriteria } from '@backstage/permission-common';
import { EntitiesSearchFilter } from '@backstage/plugin-catalog-backend';

// TODO(authorization-framework): is this the right model for composing multiple
// requirements in a single rule? We could also explore other things, like
// introducing an array of rule dependencies which are inserted before the rule
// if specified.
export const isComponentType = {
  name: 'IS_COMPONENT_TYPE',
  description: 'Allow entities with type component',
  apply(resource: Entity, componentTypes: string[]) {
    return (
      resource.kind.toLocaleLowerCase('en-US') === 'component' &&
      componentTypes
        .map(type => type.toLocaleLowerCase('en-US'))
        .includes(
          (resource as ComponentEntityV1alpha1).spec.type.toLocaleLowerCase(
            'en-US',
          ),
        )
    );
  },
  toQuery(componentTypes: string[]): PermissionCriteria<EntitiesSearchFilter> {
    return {
      anyOf: [
        {
          allOf: [
            {
              key: 'kind',
              matchValueIn: ['component'],
            },
            {
              key: 'spec.type',
              matchValueIn: componentTypes.map(type =>
                type.toLocaleLowerCase('en-US'),
              ),
            },
          ],
        },
      ],
    };
  },
};
