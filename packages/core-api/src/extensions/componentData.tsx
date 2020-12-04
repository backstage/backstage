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

import { ComponentType, ReactNode } from 'react';

const DATA_KEY = Symbol('backstage-component-data');

type DataContainer = {
  map: Map<string, unknown>;
};

type ComponentWithData<P> = ComponentType<P> & {
  [DATA_KEY]?: DataContainer;
};

type ReactNodeWithData = ReactNode & {
  type?: { [DATA_KEY]?: DataContainer };
};

export function attachComponentData<P>(
  component: ComponentType<P>,
  type: string,
  data: unknown,
) {
  const dataComponent = component as ComponentWithData<P>;

  let container = dataComponent[DATA_KEY];
  if (!container) {
    container = dataComponent[DATA_KEY] = { map: new Map() };
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

  const container = (node as ReactNodeWithData).type?.[DATA_KEY];
  if (!container) {
    return undefined;
  }

  return container.map.get(type) as T | undefined;
}
