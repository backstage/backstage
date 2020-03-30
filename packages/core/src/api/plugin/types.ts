/*
 * Copyright 2020 Spotify AB
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

import { ComponentType } from 'react';
import { Widget } from '../widgetView/types';

export type RouteOptions = {
  // Whether the route path must match exactly, defaults to true.
  exact?: boolean;
};

export type RoutePath = string;

export type RouteOutput = {
  type: 'route';
  path: RoutePath;
  component: ComponentType<{}>;
  options?: RouteOptions;
};

export type RedirectRouteOutput = {
  type: 'redirect-route';
  path: RoutePath;
  target: RoutePath;
  options?: RouteOptions;
};

export type WidgetOutput = {
  type: 'widget';
  widget: Widget;
};

export type FeatureFlagName = string;

export type FeatureFlagOutput = {
  type: 'feature-flag';
  name: FeatureFlagName;
};

export type PluginOutput =
  | RouteOutput
  | RedirectRouteOutput
  | WidgetOutput
  | FeatureFlagOutput;
