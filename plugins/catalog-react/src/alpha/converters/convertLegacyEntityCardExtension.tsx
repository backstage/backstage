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
import { BackstagePlugin, getComponentData } from '@backstage/core-plugin-api';
import { ExtensionDefinition } from '@backstage/frontend-plugin-api';
import React, { ComponentType } from 'react';
import { EntityCardBlueprint } from '../blueprints';
import kebabCase from 'lodash/kebabCase';
import { EntityPredicate } from '../predicates';
import { Entity } from '@backstage/catalog-model';

/** @alpha */
export function convertLegacyEntityCardExtension(
  LegacyExtension: ComponentType<{}>,
  overrides?: {
    name?: string;
    filter?: string | EntityPredicate | ((entity: Entity) => boolean);
  },
): ExtensionDefinition {
  const element = <LegacyExtension />;

  const extName = getComponentData<string>(element, 'core.extensionName');
  if (!extName) {
    throw new Error('Extension has no name');
  }

  const plugin = getComponentData<BackstagePlugin>(element, 'core.plugin');
  const pluginId = plugin?.getId();

  const match = extName.match(/^Entity(.*)Card$/);
  const infix = match?.[1] ?? extName;

  let name: string | undefined = infix;
  if (
    pluginId &&
    name
      .toLocaleLowerCase('en-US')
      .startsWith(pluginId.toLocaleLowerCase('en-US'))
  ) {
    name = name.slice(pluginId.length);
    if (!name) {
      name = undefined;
    }
  }
  name = name && kebabCase(name);

  return EntityCardBlueprint.make({
    name: overrides?.name ?? name,
    params: {
      filter: overrides?.filter,
      loader: async () => compatWrapper(element),
    },
  });
}
