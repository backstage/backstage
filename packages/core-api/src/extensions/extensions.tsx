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

import React, {
  NamedExoticComponent,
  ComponentType,
  PropsWithChildren,
} from 'react';
import { RouteRef } from '../routing';
import { attachComponentData } from './componentData';
import { Extension, BackstagePlugin } from '../plugin/types';

export function createRoutableExtension<Props extends {}>(options: {
  component: ComponentType<Props>;
  mountPoint: RouteRef;
  // TODO(Rugvip): We want to carry forward the exact props type from the inner component, with
  //               or without children. ComponentType stops us from doing that though, as it always
  //               adds children to the props internally. We may want to work around this with custom types.
}): Extension<
  NamedExoticComponent<PropsWithChildren<Props & { path?: string }>>
> {
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
}): Extension<NamedExoticComponent<Props>> {
  const { component } = options;
  return createReactExtension({ component });
}

export function createReactExtension<Props extends {}>(options: {
  component: ComponentType<Props>;
  data?: Record<string, unknown>;
}): Extension<NamedExoticComponent<Props>> {
  const { component: Component, data = {} } = options;
  return {
    expose(plugin: BackstagePlugin<any, any>): NamedExoticComponent<Props> {
      const Result = (props: Props) => <Component {...props} />;

      attachComponentData(Result, 'core.plugin', plugin);
      for (const [key, value] of Object.entries(data)) {
        attachComponentData(Result, key, value);
      }

      const name = Component.displayName || Component.name || 'Component';
      if (name) {
        Result.displayName = `Extension(${name})`;
      }
      return Result as NamedExoticComponent<Props>;
    },
  };
}
