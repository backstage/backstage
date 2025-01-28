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
  getComponentData,
  RouteRef as LegacyRouteRef,
} from '@backstage/core-plugin-api';
import {
  ExtensionDefinition,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import kebabCase from 'lodash/kebabCase';
import { convertLegacyRouteRef } from './convertLegacyRouteRef';
import { ComponentType } from 'react';
import { compatWrapper } from './compatWrapper';

/** @public */
export function convertLegacyPageExtension(
  LegacyExtension: ComponentType<{}>,
  overrides?: {
    name?: string;
    defaultPath?: string;
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

  const name = extName.endsWith('Page')
    ? extName.slice(0, -'Page'.length)
    : extName;
  const kebabName = kebabCase(name);

  return PageBlueprint.make({
    name: overrides?.name ?? kebabName,
    params: {
      defaultPath: overrides?.defaultPath ?? `/${kebabName}`,
      routeRef: mountPoint && convertLegacyRouteRef(mountPoint),
      loader: async () => compatWrapper(element),
    },
  });
}
