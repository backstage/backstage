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

import React, { isValidElement, ReactNode } from 'react';
import { BackstagePlugin } from './types';
import { getComponentData } from '../lib/componentData';

export const collectPlugins = (tree: ReactNode) => {
  const plugins = new Set<BackstagePlugin>();

  const nodes = [tree];

  while (nodes.length !== 0) {
    const node = nodes.shift();
    if (!isIterableElement(node)) {
      continue;
    }

    React.Children.forEach(node, child => {
      if (!isIterableElement(child)) {
        return;
      }

      const { element, children } = child.props as {
        element?: ReactNode;
        children?: ReactNode;
      };
      const plugin = getComponentData<BackstagePlugin>(child, 'core.plugin');
      if (plugin) {
        plugins.add(plugin);
      }
      if (isIterableElement(element)) {
        nodes.push(element);
      }
      nodes.push(children);
    });
  }

  return plugins;
};

function isIterableElement(node: ReactNode): node is JSX.Element {
  return isValidElement(node) || Array.isArray(node);
}
