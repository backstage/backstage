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

import {
  AppTree,
  AppNode,
  AppNodeInstance,
  AppNodeSpec,
} from '@backstage/frontend-plugin-api';

function indent(str: string) {
  return str.replace(/^/gm, '  ');
}

/** @internal */
class SerializableAppNode implements AppNode {
  public readonly spec: AppNodeSpec;
  public readonly edges = {
    attachedTo: undefined as { node: AppNode; input: string } | undefined,
    attachments: new Map<string, SerializableAppNode[]>(),
  };
  public readonly instance?: AppNodeInstance;

  constructor(spec: AppNodeSpec) {
    this.spec = spec;
  }

  setParent(parent: SerializableAppNode) {
    const input = this.spec.attachTo.input;

    this.edges.attachedTo = { node: parent, input };

    const parentInputEdges = parent.edges.attachments.get(input);
    if (parentInputEdges) {
      parentInputEdges.push(this);
    } else {
      parent.edges.attachments.set(input, [this]);
    }
  }

  toJSON() {
    const dataRefs = this.instance && [...this.instance.getDataRefs()];
    return {
      id: this.spec.id,
      output:
        dataRefs && dataRefs.length > 0
          ? dataRefs.map(ref => ref.id)
          : undefined,
      attachments:
        this.edges.attachments.size > 0
          ? Object.fromEntries(this.edges.attachments)
          : undefined,
    };
  }

  toString(): string {
    const dataRefs = this.instance && [...this.instance.getDataRefs()];
    const out =
      dataRefs && dataRefs.length > 0
        ? ` out=[${[...dataRefs].map(r => r.id).join(', ')}]`
        : '';

    if (this.edges.attachments.size === 0) {
      return `<${this.spec.id}${out} />`;
    }

    return [
      `<${this.spec.id}${out}>`,
      ...[...this.edges.attachments.entries()].map(([k, v]) =>
        indent([`${k} [`, ...v.map(e => indent(e.toString())), `]`].join('\n')),
      ),
      `</${this.spec.id}>`,
    ].join('\n');
  }
}

/**
 * Build the app tree by iterating through all node specs and constructing the app
 * tree with all attachments in the same order as they appear in the input specs array.
 * @internal
 */
export function resolveAppTree(
  rootNodeId: string,
  specs: AppNodeSpec[],
): AppTree {
  const nodes = new Map<string, SerializableAppNode>();

  // A node with the provided rootNodeId must be found in the tree, and it must not be attached to anything
  let rootNode: AppNode | undefined = undefined;

  // While iterating through the inputs specs we keep track of all nodes that were created
  // before their parent, and attach them later when the parent is created.
  // As we find the parents and attach the children, we remove them from this map. This means
  // that after iterating through all input specs, this will be a map for each root node.
  const orphansByParent = new Map<
    string /* parentId */,
    SerializableAppNode[]
  >();

  for (const spec of specs) {
    // The main check with a more helpful error message happens in resolveAppNodeSpecs
    if (nodes.has(spec.id)) {
      throw new Error(`Unexpected duplicate extension id '${spec.id}'`);
    }

    const node = new SerializableAppNode(spec);
    nodes.set(spec.id, node);

    // TODO: For now we simply ignore the attachTo spec of the root node, but it'd be cleaner if we could avoid defining it
    if (spec.id === rootNodeId) {
      rootNode = node;
    } else {
      const parent = nodes.get(spec.attachTo.id);
      if (parent) {
        node.setParent(parent);
      } else {
        const orphanNodesForParent = orphansByParent.get(spec.attachTo.id);
        if (orphanNodesForParent) {
          orphanNodesForParent.push(node);
        } else {
          orphansByParent.set(spec.attachTo.id, [node]);
        }
      }
    }

    const orphanedChildren = orphansByParent.get(spec.id);
    if (orphanedChildren) {
      orphansByParent.delete(spec.id);
      for (const orphan of orphanedChildren) {
        orphan.setParent(node);
      }
    }
  }

  if (!rootNode) {
    throw new Error(`No root node with id '${rootNodeId}' found in app tree`);
  }

  return {
    root: rootNode,
    nodes,
    orphans: Array.from(orphansByParent.values()).flat(),
  };
}
