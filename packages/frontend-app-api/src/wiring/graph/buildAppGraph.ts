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

import { AppNode, AppNodeEdges, AppNodeSpec } from './types';

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Build the app graph by iterating through all node specs and constructing the app
 * tree with all attachments in the same order as they appear in the input specs array.
 * @internal
 */
export function buildAppGraph(specs: AppNodeSpec[]) {
  const nodes = new Map<string, AppNode>();
  const rootNodes = new Map<string, AppNode>();
  // While iterating through the inputs specs we keep track of all nodes that were created
  // before their parent, and attach them later when the parent is created.
  // As we find the parents and attach the children, we remove them from this map. This means
  // that after iterating through all input specs, this will be a map for each root node.
  const orphansByParent = new Map<
    string /* parentId */,
    { orphan: AppNode; input: string }[]
  >();

  for (const spec of specs) {
    // The main check with a more helpful error message happens in resolveAppNodeSpecs
    if (nodes.has(spec.id)) {
      throw new Error(`Unexpected duplicate extension id '${spec.id}'`);
    }

    const node: AppNode = {
      spec,
      edges: {
        attachments: new Map(),
      },
    };
    nodes.set(spec.id, node);

    if (spec.attachTo) {
      const parent = nodes.get(spec.attachTo.id);
      if (parent) {
        (node.edges as Mutable<AppNodeEdges>).attachedTo = {
          node: parent,
          input: spec.attachTo.input,
        };
        const parentInputEdges = parent.edges.attachments.get(
          spec.attachTo.input,
        );
        if (parentInputEdges) {
          parentInputEdges.push(node);
        } else {
          parent.edges.attachments.set(spec.attachTo.input, [node]);
        }
      } else {
        const orphanNodesForParent = orphansByParent.get(spec.attachTo.id);
        const orphan = { orphan: node, input: spec.attachTo.input };
        if (orphanNodesForParent) {
          orphanNodesForParent.push(orphan);
        } else {
          orphansByParent.set(spec.attachTo.id, [orphan]);
        }
      }
    } else {
      rootNodes.set(spec.id, node);
    }

    const orphanedChildren = orphansByParent.get(spec.id);
    if (orphanedChildren) {
      orphansByParent.delete(spec.id);
      for (const { orphan, input } of orphanedChildren) {
        (orphan.edges as Mutable<AppNodeEdges>).attachedTo = { node, input };
        const attachments = node.edges.attachments.get(input);
        if (attachments) {
          attachments.push(orphan);
        } else {
          node.edges.attachments.set(input, [orphan]);
        }
      }
    }
  }

  const orphanNodes = new Map(
    Array.from(orphansByParent).flatMap(([, orphans]) =>
      orphans.map(({ orphan }) => [orphan.spec.id, orphan]),
    ),
  );

  return { rootNodes, orphanNodes };
}
