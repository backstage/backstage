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

import { createAppNodeInstance } from './createAppNodeInstance';
import { AppNode, Mutable } from './types';

export function instantiateAppNodeTree(rootNode: AppNode): void {
  function createInstance(node: AppNode): void {
    if (node.instance) {
      return;
    }
    if (node.spec.disabled) {
      return;
    }

    for (const children of node.edges.attachments.values()) {
      for (const child of children) {
        createInstance(child);
      }
    }

    (node as Mutable<AppNode>).instance = createAppNodeInstance({
      spec: node.spec,
      attachments: node.edges.attachments,
    });

    return;
  }

  createInstance(rootNode);
}
