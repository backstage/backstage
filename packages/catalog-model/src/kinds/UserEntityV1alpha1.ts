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
import schema from '../schema/kinds/User.v1alpha1.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';
import { createEntitySchema } from './schemaUtils';

/**
 * Backstage catalog User kind Entity.
 *
 * @public
 */
export interface UserEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'User';
  spec: {
    profile?: {
      displayName?: string;
      email?: string;
      picture?: string;
    };
    memberOf?: string[];
  };
}

/**
 * {@link KindValidator} for {@link UserEntityV1alpha1}.
 *
 * @public
 */
export const userEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(schema);

export const userEntitySchema = createEntitySchema(z => ({
  kind: z.literal('User'),
  spec: z
    .object({
      profile: z
        .object({
          displayName: z
            .string()
            .min(1)
            .optional()
            .describe('A simple display name to present to users.'),
          email: z
            .string()
            .min(1)
            .optional()
            .describe('An email where this user can be reached.'),
          picture: z
            .string()
            .min(1)
            .optional()
            .describe('The URL of an image that represents this user.'),
        })
        .optional()
        .describe(
          "Optional profile information about the user, mainly for display purposes. All fields of this structure are also optional. The email would be a primary email of some form, that the user may wish to be used for contacting them. The picture is expected to be a URL pointing to an image that's representative of the user, and that a browser could fetch and render on a profile page or similar.",
        ),
      memberOf: z
        .array(z.string().min(1))
        .optional()
        .describe(
          'The list of groups that the user is a direct member of (i.e., no transitive memberships are listed here). The list must be present, but may be empty if the user is not member of any groups. The items are not guaranteed to be ordered in any particular way. The entries of this array are entity references.',
        ),
    })
    .passthrough(),
}));
