/*
 * Copyright 2020 The Backstage Authors
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

import { ComponentType, ReactNode } from 'react';
import { getOrCreateGlobalSingleton } from '../lib/globalObject';

type DataContainer = {
  map: Map<string, unknown>;
};

// This method of storing the component data was deprecated in September 2021, it
// will be removed in the future for the reasons described below.
const globalStore = getOrCreateGlobalSingleton(
  'component-data-store',
  () => new WeakMap<ComponentType<any>, DataContainer>(),
);

// This key is used to attach component data to the component type (function or class)
// itself. This method is used because it has better compatibility component wrappers
// like react-hot-loader, as opposed to the WeakMap method or using a symbol.
const componentDataKey = '__backstage_data';

type ComponentWithData = ComponentType<any> & {
  [componentDataKey]?: DataContainer;
};

type MaybeComponentNode = ReactNode & {
  type?: ComponentWithData;
};

export function attachComponentData<P>(
  component: ComponentType<P>,
  type: string,
  data: unknown,
) {
  const dataComponent = component as ComponentWithData;

  let container = dataComponent[componentDataKey] ?? globalStore.get(component);
  if (!container) {
    container = { map: new Map() };
    Object.defineProperty(dataComponent, componentDataKey, {
      enumerable: false,
      configurable: true,
      writable: false,
      value: container,
    });
    globalStore.set(component, container);
  }

  if (container.map.has(type)) {
    const name = component.displayName || component.name;
    throw new Error(
      `Attempted to attach duplicate data "${type}" to component "${name}"`,
    );
  }

  container.map.set(type, data);
}

export function getComponentData<T>(
  node: ReactNode,
  type: string,
): T | undefined {
  if (!node) {
    return undefined;
  }

  const component = (node as MaybeComponentNode).type;
  if (!component) {
    return undefined;
  }

  const container = component[componentDataKey] ?? globalStore.get(component);
  if (!container) {
    return undefined;
  }

  return container.map.get(type) as T | undefined;
}
