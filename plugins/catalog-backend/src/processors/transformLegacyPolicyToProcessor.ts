/*
 * Copyright 2024 The Backstage Authors
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

import { EntityPolicy } from '@backstage/catalog-model';
import { CatalogProcessor } from '@backstage/plugin-catalog-node';

/**
 * Transform a given entity policy to an entity processor.
 * @param policy - The policy to transform
 * @returns A new entity processor that uses the entity policy.
 * @public
 */
export function transformLegacyPolicyToProcessor(
  policy: EntityPolicy,
): CatalogProcessor {
  return {
    getProcessorName() {
      return policy.constructor.name;
    },
    async preProcessEntity(entity) {
      // If enforcing the policy fails, throw the policy error.
      const result = await policy.enforce(entity);
      if (!result) {
        return entity;
      }
      return result;
    },
  };
}
