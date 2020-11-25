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

import React, { ExoticComponent, ComponentType } from 'react';
import { RouteRef } from '../routing';
import { attachComponentData } from './componentData';
import { Extension, BackstagePlugin } from '../plugin/types';

export function createRoutableExtension<Props extends {}>(options: {
  component: ComponentType<Props>;
  mountPoint: RouteRef;
}): Extension<ExoticComponent<Props>> {
  const { component, mountPoint } = options;
  return createReactExtension({
    component,
    data: {
      'core.mountPoint': mountPoint,
    },
  });
}

export function createComponentExtension<Props extends {}>(options: {
  component: ComponentType<Props>;
}): Extension<ExoticComponent<Props>> {
  const { component } = options;
  return createReactExtension({ component });
}

export function createReactExtension<Props extends {}>(options: {
  component: ComponentType<Props>;
  data?: Record<string, unknown>;
}): Extension<ExoticComponent<Props>> {
  const { component: Component, data = {} } = options;
  return {
    expose(plugin: BackstagePlugin): ExoticComponent<Props> {
      const Result = (props: Props) => <Component {...props} />;

      attachComponentData(Result, 'core.plugin', plugin);
      for (const [key, value] of Object.entries(data)) {
        attachComponentData(Result, key, value);
      }

      return Result as ExoticComponent<Props>;
    },
  };
}
