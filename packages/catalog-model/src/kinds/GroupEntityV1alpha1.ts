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
import schema from '../schema/kinds/Group.v1alpha1.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';
import { createEntitySchema } from './schemaUtils';
/**
 * Backstage catalog Group kind Entity.
 *
 * @public
 */
export interface GroupEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'Group';
  spec: {
    type: string;
    profile?: {
      displayName?: string;
      email?: string;
      picture?: string;
    };
    parent?: string;
    children: string[];
    members?: string[];
  };
}

/**
 * {@link KindValidator} for {@link GroupEntityV1alpha1}.
 * @public
 */
export const groupEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(schema);

export const groupEntitySchema = createEntitySchema(z => ({
  kind: z.literal('Group'),
  spec: z
    .object({
      type: z
        .string()
        .min(1)
        .describe(
          'The type of group. There is currently no enforced set of values for this field, so it is left up to the adopting organization to choose a nomenclature that matches their org hierarchy.',
        ),
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
            .describe('An email where this entity can be reached.'),
          picture: z
            .string()
            .min(1)
            .optional()
            .describe('The URL of an image that represents this entity.'),
        })
        .optional()
        .describe(
          "Optional profile information about the group, mainly for display purposes. All fields of this structure are also optional. The email would be a group email of some form, that the group may wish to be used for contacting them. The picture is expected to be a URL pointing to an image that's representative of the group, and that a browser could fetch and render on a group page or similar.",
        ),
      parent: z
        .string()
        .min(1)
        .optional()
        .describe(
          'The immediate parent group in the hierarchy, if any. Not all groups must have a parent; the catalog supports multi-root hierarchies. Groups may however not have more than one parent. This field is an entity reference.',
        ),
      children: z
        .array(z.string().min(1))
        .describe(
          'The immediate child groups of this group in the hierarchy (whose parent field points to this group). The list must be present, but may be empty if there are no child groups. The items are not guaranteed to be ordered in any particular way. The entries of this array are entity references.',
        ),
      members: z
        .array(z.string().min(1))
        .optional()
        .describe(
          'The users that are members of this group. The entries of this array are entity references.',
        ),
    })
    .passthrough(),
}));
