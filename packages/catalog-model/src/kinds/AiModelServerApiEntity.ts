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

import { createCatalogModelLayer } from '../model/createCatalogModelLayer';
import type { ApiEntityV1alpha1 } from './ApiEntityV1alpha1';
import type { ApiRemote } from './ApiRemote';
import aiModelServerSchema from '../schema/kinds/API.v1alpha1.ai-model-server.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';

/**
 * An AI model server represented as an API entity
 * (spec.type: 'ai-model-server').
 *
 * @alpha
 */
export interface AiModelServerApiEntity
  extends Omit<ApiEntityV1alpha1, 'spec'> {
  spec: {
    type: 'ai-model-server';
    lifecycle: string;
    owner: string;
    system?: string;
    remotes: ApiRemote[];
  };
}

/**
 * {@link KindValidator} for the `ai-model-server` specType of API entities.
 *
 * @alpha
 */
export const aiModelServerApiEntityValidator =
  ajvCompiledJsonSchemaValidator(aiModelServerSchema);

/**
 * Type guard: narrows an entity to the AI model server API subtype.
 *
 * @alpha
 */
export function isAiModelServerApiEntity(
  entity: ApiEntityV1alpha1 | AiModelServerApiEntity,
): entity is AiModelServerApiEntity {
  return entity.spec.type === 'ai-model-server';
}

/**
 * Extends the API kind with the ai-model-server specType.
 *
 * @alpha
 */
export const aiModelServerApiEntityModel = createCatalogModelLayer({
  layerId: 'catalog.backstage.io/kind-api-ai-model-server',
  builder: model => {
    model.addKindVersion({
      kind: 'API',
      versions: [
        {
          name: ['v1alpha1', 'v1beta1'],
          specType: 'ai-model-server',
          description: 'An AI model server exposed as an API entity.',
          relationFields: [
            {
              selector: { path: 'spec.owner' },
              relation: 'ownedBy',
              defaultKind: 'Group',
              defaultNamespace: 'inherit',
              allowedKinds: ['Group', 'User'],
            },
            {
              selector: { path: 'spec.system' },
              relation: 'partOf',
              defaultKind: 'System',
              defaultNamespace: 'inherit',
            },
          ],
          schema: { jsonSchema: aiModelServerSchema },
        },
      ],
    });
  },
});
