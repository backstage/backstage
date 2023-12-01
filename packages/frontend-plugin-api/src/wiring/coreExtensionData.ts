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

import { ComponentType, JSX } from 'react';
import {
  AnyApiFactory,
  AppTheme,
  IconComponent,
} from '@backstage/core-plugin-api';
import { RouteRef } from '../routing';
import { ComponentRef } from '../components';
import { createExtensionDataRef } from './createExtensionDataRef';

/** @public */
export type NavTarget = {
  title: string;
  icon: IconComponent;
  routeRef: RouteRef<undefined>;
};

/** @public */
export type LogoElements = {
  logoIcon?: JSX.Element;
  logoFull?: JSX.Element;
};

/** @public */
export const coreExtensionData = {
  reactElement: createExtensionDataRef<JSX.Element>('core.reactElement'),
  routePath: createExtensionDataRef<string>('core.routing.path'),
  apiFactory: createExtensionDataRef<AnyApiFactory>('core.api.factory'),
  routeRef: createExtensionDataRef<RouteRef>('core.routing.ref'),
  navTarget: createExtensionDataRef<NavTarget>('core.nav.target'),
  theme: createExtensionDataRef<AppTheme>('core.theme'),
  logoElements: createExtensionDataRef<LogoElements>('core.logos'),
  component: createExtensionDataRef<{
    ref: ComponentRef;
    impl: ComponentType;
  }>('core.component'),
};
