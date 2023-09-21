/*
 * Copyright 2023 The Backstage Authors
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

import { JSX } from 'react';
import {
  AnyApiFactory,
  IconComponent,
  RouteRef,
} from '@backstage/core-plugin-api';
import { createExtensionDataRef } from './createExtensionDataRef';

/** @public */
export type NavTarget = {
  title: string;
  icon: IconComponent;
  routeRef: RouteRef<{}>;
};

/** @public */
export const coreExtensionData = {
  // TODO: We'd want to figure out if we can better structure extension data ref declarations to avoid the ID duplication
  reactElement: createExtensionDataRef<JSX.Element, 'core.reactElement'>(
    'core.reactElement',
  ),
  routePath: createExtensionDataRef<string, 'core.routing.path'>(
    'core.routing.path',
  ),
  apiFactory: createExtensionDataRef<AnyApiFactory, 'core.api.factory'>(
    'core.api.factory',
  ),
  routeRef: createExtensionDataRef<RouteRef, 'core.routing.ref'>(
    'core.routing.ref',
  ),
  navTarget: createExtensionDataRef<NavTarget, 'core.nav.target'>(
    'core.nav.target',
  ),
};
