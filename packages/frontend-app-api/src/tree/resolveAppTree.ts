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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExtension } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';
import { ErrorCollector } from '../wiring/createErrorCollector';

function indent(str: string) {
  return str.replace(/^/gm, '  ');
}

/** @internal */
export class SerializableAppNode implements AppNode {
  public readonly spec: AppNodeSpec;
  public readonly edges = {
    attachedTo: undefined as { node: AppNode; input: string } | undefined,
    attachments: new Map<string, SerializableAppNode[]>(),
  };
  public readonly instance?: AppNodeInstance;

  constructor(spec: AppNodeSpec) {
    this.spec = spec;
  }

  setParent(parent: SerializableAppNode, input: string) {
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

function makeRedirectKey(attachTo: { id: string; input: string }) {
  return `${attachTo.id}%${attachTo.input}`;
}

const isValidAttachmentPoint = (
  attachTo: { id: string; input: string },
  nodes: Map<string, SerializableAppNode>,
) => {
  if (!nodes.has(attachTo.id)) {
    return false;
  }

  return (
    attachTo.input in
    toInternalExtension(nodes.get(attachTo.id)!.spec.extension).inputs
  );
};

/**
 * Build the app tree by iterating through all node specs and constructing the app
 * tree with all attachments in the same order as they appear in the input specs array.
 * @internal
 */
export function resolveAppTree(
  rootNodeId: string,
  specs: AppNodeSpec[],
  errorCollector: ErrorCollector,
): AppTree {
  const nodes = new Map<string, SerializableAppNode>();

  const redirectTargetsByKey = new Map<string, { id: string; input: string }>();

  for (const spec of specs) {
    // The main check with a helpful error message happens in resolveAppNodeSpecs
    if (nodes.has(spec.id)) {
      continue;
    }

    const node = new SerializableAppNode(spec);
    nodes.set(spec.id, node);

    const internal = toInternalExtension(spec.extension);
    for (const [inputName, input] of Object.entries(internal.inputs)) {
      if (input.replaces) {
        for (const replace of input.replaces) {
          const key = makeRedirectKey(replace);
          if (redirectTargetsByKey.has(key)) {
            errorCollector.report({
              code: 'EXTENSION_INPUT_REDIRECT_CONFLICT',
              message: `Duplicate redirect target for input '${inputName}' in extension '${spec.id}'`,
              context: {
                node,
                inputName,
              },
            });
            continue;
          }
          redirectTargetsByKey.set(key, { id: spec.id, input: inputName });
        }
      }
    }
  }

  const orphans = new Array<SerializableAppNode>();
  const clones = new Map<string, Array<SerializableAppNode>>();

  // A node with the provided rootNodeId must be found in the tree, and it must not be attached to anything
  let rootNode: AppNode | undefined = undefined;

  for (const node of nodes.values()) {
    const spec = node.spec;

    // TODO: For now we simply ignore the attachTo spec of the root node, but it'd be cleaner if we could avoid defining it
    if (spec.id === rootNodeId) {
      rootNode = node;
    } else if (Array.isArray(spec.attachTo)) {
      // eslint-disable-next-line no-console
      console.warn(
        `Extension '${spec.id}' is using multiple attachment points which is deprecated and will be removed in a future release. ` +
          `Use a Utility API instead to share functionality across multiple locations. ` +
          `See https://backstage.io/docs/frontend-system/architecture/27-sharing-extensions for migration guidance.`,
      );
      let foundFirstParent = false;
      for (const origAttachTo of spec.attachTo) {
        let attachTo = origAttachTo;

        if (!isValidAttachmentPoint(attachTo, nodes)) {
          attachTo =
            redirectTargetsByKey.get(makeRedirectKey(attachTo)) ?? attachTo;
        }

        const parent = nodes.get(attachTo.id);
        if (parent) {
          const cloneParents = clones.get(attachTo.id) ?? [];

          if (!foundFirstParent) {
            foundFirstParent = true;
            node.setParent(parent, attachTo.input);
          } else {
            cloneParents.unshift(parent);
          }

          for (const extraParent of cloneParents) {
            const clonedNode = new SerializableAppNode(spec);
            clonedNode.setParent(extraParent, attachTo.input);
            clones.set(
              spec.id,
              clones.get(spec.id)?.concat(clonedNode) ?? [clonedNode],
            );
          }
        }
      }
      if (!foundFirstParent) {
        orphans.push(node);
      }
    } else {
      let attachTo = spec.attachTo;
      if (!isValidAttachmentPoint(attachTo, nodes)) {
        attachTo =
          redirectTargetsByKey.get(makeRedirectKey(attachTo)) ?? attachTo;
      }

      const parent = nodes.get(attachTo.id);
      if (parent) {
        node.setParent(parent, attachTo.input);
      } else {
        orphans.push(node);
      }
    }
  }

  if (!rootNode) {
    throw new Error(`No root node with id '${rootNodeId}' found in app tree`);
  }

  return {
    root: rootNode,
    nodes,
    orphans,
  };
}

/**
 * Detaches a node from its parent, and returns where it was attached.
 */
function detachAppNode(
  node: AppNode,
): { parent: AppNode; input: string; index: number } | undefined {
  const attachedTo = node.edges.attachedTo;
  if (!attachedTo) {
    return undefined;
  }
  const siblings = attachedTo.node.edges.attachments.get(attachedTo.input) as
    | AppNode[]
    | undefined;
  const index = siblings?.indexOf(node) ?? -1;
  if (!siblings || index === -1) {
    return undefined;
  }
  siblings.splice(index, 1);
  return { parent: attachedTo.node, input: attachedTo.input, index };
}

/** Removes a node and all of its attachments from the node index. */
function removeAppNodeSubtree(nodes: Map<string, AppNode>, node: AppNode) {
  if (nodes.get(node.spec.id) === node) {
    nodes.delete(node.spec.id);
  }
  for (const children of node.edges.attachments.values()) {
    for (const child of children) {
      removeAppNodeSubtree(nodes, child);
    }
  }
}

function attachAppNode(
  node: SerializableAppNode,
  parent: AppNode,
  input: string,
  index?: number,
) {
  node.edges.attachedTo = { node: parent, input };

  const attachments = parent.edges.attachments as Map<string, AppNode[]>;
  const siblings = attachments.get(input);
  if (!siblings) {
    attachments.set(input, [node]);
  } else if (index === undefined) {
    siblings.push(node);
  } else {
    siblings.splice(index, 0, node);
  }
}

/**
 * Adds nodes for the given specs to an app tree that has already been
 * resolved.
 *
 * @remarks
 *
 * A spec with the same ID as an existing node replaces that node. If the new
 * node attaches to the same input as the node it replaces, it takes the same
 * position among the attachments of that input. Existing attachments of the
 * replaced node, for example extensions from modules, are moved over to the
 * new node unless they are replaced as well or listed as stale. New nodes can attach to each
 * other as well as to existing nodes.
 *
 * Existing node instances are left untouched, and the new nodes are not
 * instantiated.
 *
 * @returns The new nodes, in the order of the specs.
 * @internal
 */
export function graftAppTreeNodes(
  tree: AppTree,
  specs: AppNodeSpec[],
  options?: {
    /**
     * IDs of existing nodes that are no longer provided, for example stub
     * extensions that the loaded plugin doesn't have. Such attachments of a
     * replaced node are removed from the tree along with their attachments,
     * instead of being moved over to the new node.
     */
    staleIds?: ReadonlySet<string>;
  },
): AppNode[] {
  const nodes = tree.nodes as Map<string, AppNode>;
  const newNodes = new Map<string, SerializableAppNode>();

  for (const spec of specs) {
    if (Array.isArray(spec.attachTo)) {
      throw new Error(
        `Extension '${spec.id}' can't be added to an existing app tree because it uses multiple attachment points`,
      );
    }
    if (!newNodes.has(spec.id)) {
      newNodes.set(spec.id, new SerializableAppNode(spec));
    }
  }

  for (const node of newNodes.values()) {
    const attachTo = node.spec.attachTo as { id: string; input: string };

    const replacedNode = nodes.get(node.spec.id);
    const replacedPosition = replacedNode
      ? detachAppNode(replacedNode)
      : undefined;
    if (replacedNode) {
      for (const [input, children] of replacedNode.edges.attachments) {
        for (const child of children) {
          if (newNodes.has(child.spec.id)) {
            continue;
          }
          if (options?.staleIds?.has(child.spec.id)) {
            removeAppNodeSubtree(nodes, child);
          } else {
            // All nodes of a resolved tree are serializable nodes
            attachAppNode(child as SerializableAppNode, node, input);
          }
        }
      }
    }

    const parent = newNodes.get(attachTo.id) ?? nodes.get(attachTo.id);
    if (!parent) {
      if (Array.isArray(tree.orphans)) {
        tree.orphans.push(node);
      }
      continue;
    }

    const keepsPosition =
      replacedPosition?.parent === parent &&
      replacedPosition.input === attachTo.input;
    attachAppNode(
      node,
      parent,
      attachTo.input,
      keepsPosition ? replacedPosition.index : undefined,
    );
  }

  for (const node of newNodes.values()) {
    nodes.set(node.spec.id, node);
  }

  return Array.from(newNodes.values());
}
