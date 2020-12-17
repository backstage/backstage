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

import React from 'react';
import { RouteRef } from '../routing';
import { attachComponentData } from './componentData';
import { Extension, BackstagePlugin } from '../plugin/types';

export function createRoutableExtension<
  T extends (props: any) => JSX.Element
>(options: { component: T; mountPoint: RouteRef }): Extension<T> {
  const { component, mountPoint } = options;
  return createReactExtension({
    component,
    data: {
      'core.mountPoint': mountPoint,
    },
  });
}

export function createComponentExtension<
  T extends (props: any) => JSX.Element
>(options: { component: T }): Extension<T> {
  const { component } = options;
  return createReactExtension({ component });
}

export function createReactExtension<
  T extends (props: any) => JSX.Element
>(options: { component: T; data?: Record<string, unknown> }): Extension<T> {
  const { data = {} } = options;
  const Component = options.component as T & {
    displayName?: string;
  };

  return {
    expose(plugin: BackstagePlugin<any, any>) {
      const Result: any = (props: any) => <Component {...props} />;

      attachComponentData(Result, 'core.plugin', plugin);
      for (const [key, value] of Object.entries(data)) {
        attachComponentData(Result, key, value);
      }

      const name = Component.displayName || Component.name || 'Component';
      if (name) {
        Result.displayName = `Extension(${name})`;
      }
      return Result;
    },
  };
}
