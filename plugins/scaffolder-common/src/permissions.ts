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

import { createPermission } from '@backstage/plugin-permission-common';

export const RESOURCE_TYPE_SCAFFOLDER_TEMPLATE = 'scaffolder-template';

export const templateParameterReadPermission = createPermission({
  name: 'scaffolder.template.parameter.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
});

export const templatePropertyReadPermission = createPermission({
  name: 'scaffolder.template.property.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
});

export const templateStepReadPermission = createPermission({
  name: 'scaffolder.template.step.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
});

export const scaffolderPermissions = [
  templatePropertyReadPermission,
  templateParameterReadPermission,
  templateStepReadPermission,
];

/**
 * TODOs:
 * 1. ~Implement for Parameters & Properties~
 * 2. What metadata should be included in the template?
 * 3. Write tests
 * 4. Write documentation
 */
