/*
 * Copyright 2021 Spotify AB
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
import { getComponentData } from './componentData';

/**
 * Returns an array of each component data value for a given key of each
 * element in the entire react element tree starting at the provided children.
 *
 * - This was needed to grab the actual component data once we had narrowed down the set of children
 */
export const useCollectComponentData = <T>(
  children: React.ReactNode,
  componentDataKey: string,
) => {
  const stack = [children];
  const found: T[] = [];

  while (stack.length) {
    const current: React.ReactNode = stack.pop()!;

    React.Children.forEach(current, child => {
      if (!React.isValidElement(child)) {
        return;
      }

      const data = getComponentData<T>(child, componentDataKey);
      if (data) {
        found.push(data);
      }

      if (child.props.children) {
        stack.push(child.props.children);
      }
    });
  }

  return found;
};

/**
 * Returns an array of all values of the children prop of each element with the entire
 * react element tree that has component data for the given key.
 *
 * - this was needed to collect the children of ScaffolderFieldExtensions elements
 */
export const useCollectChildren = (
  component: React.ReactNode,
  componentDataKey: string,
) => {
  const stack = [component];
  const found: React.ReactNode[] = [];

  while (stack.length) {
    const current: React.ReactNode = stack.pop()!;

    React.Children.forEach(current, child => {
      if (!React.isValidElement(child)) {
        return;
      }

      if (child.props.children) {
        if (getComponentData(child, componentDataKey)) {
          found.push(child.props.children);
        }
        stack.push(child.props.children);
      }
    });
  }

  return found;
};

/**
 *
 *
 * TODO:
 *  support:
 *    - entity layout route traversal
 *    - scaffolder field extension enumeration
 *    - FlatRoutes
 *    - Respecting feature flags
 */
export function useElementCollection(children: ReactNode) {}
