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
import schema from '../schema/kinds/API.v1alpha1.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';
import { z } from 'zod';
import { createEntitySchema } from './schemaUtils';

/**
 * Backstage API kind Entity. APIs describe the interfaces for Components to communicate.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface ApiEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'API';
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    definition: string;
    system?: string;
  };
}

/**
 * {@link KindValidator} for {@link ApiEntityV1alpha1}.
 *
 * @public
 */
export const apiEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(schema);

export const apiEntitySchema = createEntitySchema({
  kind: z.literal('API'),
  spec: z
    .object({
      type: z.string().min(1).describe('The type of the API definition.'),
      lifecycle: z.string().min(1).describe('The lifecycle state of the API.'),
      owner: z
        .string()
        .min(1)
        .describe('An entity reference to the owner of the API.'),
      system: z
        .string()
        .min(1)
        .optional()
        .describe('An entity reference to the system that the API belongs to.'),
      definition: z
        .string()
        .min(1)
        .describe(
          'The definition of the API, based on the format defined by the type.',
        ),
    })
    .passthrough(),
});
