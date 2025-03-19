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

import type { Entity } from '../entity/Entity';
import { ajvCompiledJsonSchemaValidator } from './util';
import schema from '../schema/kinds/System.v1alpha1.schema.json';
import { createEntitySchema } from './schemaUtils';
/**
 * Backstage catalog System kind Entity. Systems group Components, Resources and APIs together.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface SystemEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'System';
  spec: {
    owner: string;
    domain?: string;
    type?: string;
  };
}

/**
 * {@link KindValidator} for {@link SystemEntityV1alpha1}.
 *
 * @public
 */
export const systemEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(schema);

export const systemEntitySchema = createEntitySchema(z => ({
  kind: z.literal('System'),
  spec: z
    .object({
      owner: z
        .string()
        .min(1)
        .describe('An entity reference to the owner of the component.'),
      domain: z
        .string()
        .min(1)
        .optional()
        .describe(
          'An entity reference to the domain that the system belongs to.',
        ),
      type: z
        .string()
        .min(1)
        .optional()
        .describe(
          'The type of system. There is currently no enforced set of values for this field, so it is left up to the adopting organization to choose a nomenclature that matches their catalog hierarchy.',
        ),
    })
    .passthrough(),
}));
