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

import { compatWrapper } from '@backstage/core-compat-api';
import { getComponentData } from '@backstage/core-plugin-api';
import { ExtensionDefinition } from '@backstage/frontend-plugin-api';
import kebabCase from 'lodash/kebabCase';
import React, { ComponentType } from 'react';
import { EntityCardBlueprint } from '../blueprints';

/** @alpha */
export function convertLegacyEntityCardExtension(
  LegacyExtension: ComponentType<{}>,
  overrides?: {
    name?: string;
    filter?:
      | typeof EntityCardBlueprint.dataRefs.filterFunction.T
      | typeof EntityCardBlueprint.dataRefs.filterExpression.T;
  },
): ExtensionDefinition<any> {
  const element = <LegacyExtension />;

  const extName = getComponentData<string>(element, 'core.extensionName');
  if (!extName) {
    throw new Error('Extension has no name');
  }

  const match = extName.match(/^Entity(.*)Card$/);
  const name = match?.[1] ?? extName;
  const kebabName = kebabCase(name);

  return EntityCardBlueprint.make({
    name: overrides?.name ?? kebabName,
    params: {
      filter: overrides?.filter,
      loader: async () => compatWrapper(element),
    },
  });
}
