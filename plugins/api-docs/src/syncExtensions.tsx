/*
 * Copyright 2026 The Backstage Authors
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

import { ApiBlueprint } from '@backstage/frontend-plugin-api';
import {
  ApiEntity,
  parseEntityRef,
  RELATION_HAS_PART,
} from '@backstage/catalog-model';
import { EntityCardBlueprint } from '@backstage/plugin-catalog-react/alpha';
// Imported directly to keep the definition card out of the sync entry point
import { defaultDefinitionWidgets } from './components/ApiDefinitionCard/ApiDefinitionWidget';
import { apiDocsConfigRef } from './config';

// The extensions in this module are part of both the full plugin and its sync
// entry point, so that they are the same objects in both.

export const apiDocsConfigApi = ApiBlueprint.make({
  name: 'config',
  params: defineParams =>
    defineParams({
      api: apiDocsConfigRef,
      deps: {},
      factory: () => {
        const definitionWidgets = defaultDefinitionWidgets();
        return {
          getApiDefinitionWidget: (apiEntity: ApiEntity) => {
            return definitionWidgets.find(d => d.type === apiEntity.spec.type);
          },
        };
      },
    }),
});

export const apiDocsHasApisEntityCard = EntityCardBlueprint.make({
  name: 'has-apis',
  params: {
    // Omitting configSchema for now
    // We are skipping variants and columns are too complex to map to zod
    // See: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
    filter: entity => {
      return (
        entity.kind === 'Component' &&
        entity.relations?.some(
          ({ type, targetRef }) =>
            type.toLowerCase() === RELATION_HAS_PART &&
            parseEntityRef(targetRef).kind === 'API',
        )!!
      );
    },
    loader: () => import('./components/ApisCards').then(m => <m.HasApisCard />),
  },
});
