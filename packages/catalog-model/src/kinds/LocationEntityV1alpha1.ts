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

import { z } from 'zod';
import type { Entity } from '../entity/Entity';
import schema from '../schema/kinds/Location.v1alpha1.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';
import { createEntitySchema } from './schemaUtils';
/**
 * Backstage catalog Location kind Entity.
 *
 * @public
 */
export interface LocationEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'Location';
  spec: {
    type?: string;
    target?: string;
    targets?: string[];
    presence?: 'required' | 'optional';
  };
}

/**
 * {@link KindValidator} for {@link LocationEntityV1alpha1}.
 *
 * @public
 */
export const locationEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(schema);

export const locationEntitySchema = createEntitySchema({
  kind: z.literal('Location'),
  spec: z
    .object({
      type: z
        .string()
        .min(1)
        .optional()
        .describe(
          "The single location type, that's common to the targets specified in the spec. If it is left out, it is inherited from the location type that originally read the entity data.",
        ),
      target: z
        .string()
        .min(1)
        .optional()
        .describe(
          'A single target as a string. Can be either an absolute path/URL (depending on the type), or a relative path such as ./details/catalog-info.yaml which is resolved relative to the location of this Location entity itself.',
        ),
      targets: z
        .array(z.string().min(1))
        .optional()
        .describe(
          'A list of targets as strings. They can all be either absolute paths/URLs (depending on the type), or relative paths such as ./details/catalog-info.yaml which are resolved relative to the location of this Location entity itself.',
        ),
      presence: z
        .enum(['required', 'optional'])
        .optional()
        .describe(
          'Whether the presence of the location target is required and it should be considered an error if it can not be found',
        ),
    })
    .passthrough(),
});
