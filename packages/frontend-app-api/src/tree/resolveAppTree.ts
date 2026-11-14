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
import { ExtensionInputSettings } from './readAppExtensionsConfig';

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
 * tree with attachments in the same order as the input specs array, then applying
 * configured input ordering after all attachments and redirects are resolved.
 * @internal
 */
export function resolveAppTree(
  rootNodeId: string,
  specs: AppNodeSpec[],
  errorCollector: ErrorCollector,
  inputSettings: Map<string, ExtensionInputSettings> = new Map(),
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

  for (const [nodeId, inputs] of inputSettings) {
    const node = nodes.get(nodeId);
    if (!node) continue;
    for (const [inputName, settings] of Object.entries(inputs)) {
      if (
        !Object.prototype.hasOwnProperty.call(
          toInternalExtension(node.spec.extension).inputs,
          inputName,
        )
      ) {
        errorCollector.report({
          code: 'EXTENSION_CONFIGURATION_INVALID',
          message: `Unknown configured input '${inputName}' in extension '${node.spec.id}'; ignoring its settings`,
          context: { node },
        });
        continue;
      }
      if (!settings.order) continue;
      const children = node.edges.attachments.get(inputName) ?? [];
      const byId = new Map(children.map(child => [child.spec.id, child]));
      const mentioned = new Set(settings.order);
      const rest = children.filter(child => !mentioned.has(child.spec.id));
      const ordered = settings.order.flatMap(id => {
        if (id === '*') return rest;
        const child = byId.get(id);
        return child ? [child] : [];
      });
      if (!mentioned.has('*')) ordered.push(...rest);
      node.edges.attachments.set(inputName, ordered);
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
