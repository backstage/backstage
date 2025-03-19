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
import schema from '../schema/kinds/Component.v1alpha1.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';
import { createEntitySchema } from './schemaUtils';
/**
 * Backstage catalog Component kind Entity. Represents a single, individual piece of software.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface ComponentEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'Component';
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    subcomponentOf?: string;
    providesApis?: string[];
    consumesApis?: string[];
    dependsOn?: string[];
    dependencyOf?: string[];
    system?: string;
  };
}

/**
 * {@link KindValidator} for {@link ComponentEntityV1alpha1}.
 *
 * @public
 */
export const componentEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(schema);

export const componentEntitySchema = createEntitySchema(z => ({
  kind: z.literal('Component'),
  spec: z
    .object({
      type: z.string().min(1).describe('The type of component.'),
      lifecycle: z
        .string()
        .min(1)
        .describe('The lifecycle state of the component.'),
      owner: z
        .string()
        .min(1)
        .describe('An entity reference to the owner of the component.'),
      subcomponentOf: z
        .string()
        .min(1)
        .optional()
        .describe('An entity reference to the parent component.'),
      providesApis: z
        .array(z.string().min(1))
        .optional()
        .describe(
          'An array of entity references to the APIs that the component provides.',
        ),
      consumesApis: z
        .array(z.string().min(1))
        .optional()
        .describe(
          'An array of entity references to the APIs that the component consumes.',
        ),
      dependsOn: z
        .array(z.string().min(1))
        .optional()
        .describe(
          'An array of references to other entities that the component depends on to function.',
        ),
      system: z
        .string()
        .min(1)
        .optional()
        .describe(
          'An entity reference to the system that the component belongs to.',
        ),
    })
    .passthrough(),
}));
