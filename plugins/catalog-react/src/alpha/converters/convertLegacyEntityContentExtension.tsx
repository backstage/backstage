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

import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import {
  BackstagePlugin,
  getComponentData,
  RouteRef as LegacyRouteRef,
} from '@backstage/core-plugin-api';
import { ExtensionDefinition } from '@backstage/frontend-plugin-api';
import kebabCase from 'lodash/kebabCase';
import startCase from 'lodash/startCase';
import { ComponentType, ReactElement } from 'react';
import { EntityContentBlueprint } from '../blueprints/EntityContentBlueprint';
import { EntityPredicate } from '../predicates/types';
import { Entity } from '@backstage/catalog-model';

/** @alpha */
export function convertLegacyEntityContentExtension(
  LegacyExtension: ComponentType<{}>,
  overrides?: {
    name?: string;
    filter?: string | EntityPredicate | ((entity: Entity) => boolean);
    path?: string;
    title?: string;
    icon?: string | ReactElement;

    /**
     * @deprecated Use the `path` param instead.
     */
    defaultPath?: [Error: `Use the 'path' override instead`];

    /**
     * @deprecated Use the `path` param instead.
     */
    defaultTitle?: [Error: `Use the 'title' override instead`];
  },
): ExtensionDefinition {
  const element = <LegacyExtension />;

  const extName = getComponentData<string>(element, 'core.extensionName');
  if (!extName) {
    throw new Error('Extension has no name');
  }

  const mountPoint = getComponentData<LegacyRouteRef>(
    element,
    'core.mountPoint',
  );

  const plugin = getComponentData<BackstagePlugin>(element, 'core.plugin');
  const pluginId = plugin?.getId();

  const match = extName.match(/^Entity(.*)Content$/);
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
  // TODO(blam): Remove support for all the `default*` props in the future, this breaks backwards compatibility without it
  // As this is marked as BREAKING ALPHA, it doesn't affect the public API so it falls in range and gets picked
  // up by packages that depend on `catalog-react`.
  return EntityContentBlueprint.make({
    name: overrides?.name ?? name,
    params: {
      filter: overrides?.filter,
      path: (overrides?.path ??
        overrides?.defaultPath ??
        `/${kebabCase(infix)}`) as string,
      title: (overrides?.title ??
        overrides?.defaultTitle ??
        startCase(infix)) as string,
      icon: overrides?.icon,
      routeRef: mountPoint && convertLegacyRouteRef(mountPoint),
      loader: async () => compatWrapper(element),
    },
  });
}
