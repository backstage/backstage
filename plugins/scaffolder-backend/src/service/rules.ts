/*
 * Copyright 2022 The Backstage Authors
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

import { makeCreatePermissionRule } from '@backstage/plugin-permission-node';
import {
  RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  TemplateEntityStepV1beta3,
  TemplateParameter,
} from '@backstage/plugin-scaffolder-common';
import { TemplateProperty } from '@backstage/plugin-scaffolder-common';
import { z } from 'zod';

export const createScaffolderStepPermissionRule = makeCreatePermissionRule<
  TemplateEntityStepV1beta3 | TemplateProperty | TemplateParameter,
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_TEMPLATE
>();

const hasTag = createScaffolderStepPermissionRule({
  name: 'HAS_TAG',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  description: 'Match a scaffolder step with the given tag',
  paramsSchema: z.object({
    tag: z.string().describe('Name of the tag to match on'),
  }),
  apply: (resource, { tag }) => {
    return resource.metadata?.tags?.includes(tag) ?? false;
  },
  toQuery: () => ({}),
});

export const scaffolderStepRules = { hasTag };
