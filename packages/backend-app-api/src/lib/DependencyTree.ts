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

import { ForwardedError, InputError } from '@backstage/errors';

interface NodeInput {
  id: string;
  consumes?: Iterable<string>;
  produces?: Iterable<string>;
}

/** @internal */
class Node {
  static from(input: NodeInput) {
    return new Node(
      input.id,
      input.consumes ? new Set(input.consumes) : new Set(),
      input.produces ? new Set(input.produces) : new Set(),
    );
  }

  private constructor(
    readonly id: string,
    readonly consumes: Set<string>,
    readonly produces: Set<string>,
  ) {}
}

/** @internal */
export class DependencyTree {
  static fromMap(nodes: Record<string, Omit<NodeInput, 'id'>>) {
    return this.fromIterable(
      Object.entries(nodes).map(([id, node]) => ({ id, ...node })),
    );
  }

  static fromIterable(nodeInputs: Iterable<NodeInput>) {
    const nodes = new Map<string, Node>();
    for (const nodeInput of nodeInputs) {
      const node = Node.from(nodeInput);
      if (nodes.has(node.id)) {
        throw new InputError(`Duplicate node with id ${node.id}`);
      }
      nodes.set(node.id, node);
    }

    return new DependencyTree(nodes);
  }

  #allProduced: Set<string>;
  #allConsumed: Set<string>;
  #consumedBy: Map<string, Set<string>>;

  private constructor(readonly nodes: Map<string, Node>) {
    this.#allProduced = new Set();
    this.#allConsumed = new Set();
    this.#consumedBy = new Map();

    for (const node of this.nodes.values()) {
      for (const produced of node.produces) {
        this.#allProduced.add(produced);
      }
      for (const consumed of node.consumes) {
        this.#allConsumed.add(consumed);
        if (!this.#consumedBy.get(consumed)?.add(node.id)) {
          this.#consumedBy.set(consumed, new Set([node.id]));
        }
      }
    }
  }

  findUnsatisfiedDeps(): Array<{ id: string; unsatisfied: string[] }> {
    const unsatisfiedDependencies = [];
    for (const node of this.nodes.values()) {
      const unsatisfied = Array.from(node.consumes).filter(
        id => !this.#allProduced.has(id),
      );
      if (unsatisfied.length > 0) {
        unsatisfiedDependencies.push({ id: node.id, unsatisfied });
      }
    }
    return unsatisfiedDependencies;
  }

  detectCircularDependency(): string[] | undefined {
    for (const nodeId of this.nodes.keys()) {
      const visited = new Set<string>();
      const stack = new Array<[id: string, path: string[]]>([nodeId, [nodeId]]);

      while (stack.length > 0) {
        const [id, path] = stack.pop()!;
        if (visited.has(id)) {
          continue;
        }
        visited.add(id);
        const node = this.nodes.get(id);
        if (node) {
          for (const produced of node.produces) {
            const consumers = this.#consumedBy.get(produced);
            if (consumers) {
              for (const consumer of consumers) {
                if (consumer === nodeId) {
                  return [...path, nodeId];
                }
                if (!visited.has(consumer)) {
                  stack.push([consumer, [...path, consumer]]);
                }
              }
            }
          }
        }
      }
    }
    return undefined;
  }

  async parallelTopologicalTraversal<T>(
    fn: (nodeId: string) => Promise<T>,
  ): Promise<T[]> {
    const allProduced = this.#allProduced;
    const producedSoFar = new Set<string>();
    const waiting = new Set(this.nodes.values());
    const visited = new Set<string>();
    const results = new Array<T>();
    let inFlight = 0;

    async function processMoreNodes() {
      if (waiting.size === 0) {
        return;
      }
      const nodesToProcess = [];
      for (const node of waiting) {
        let ready = true;
        for (const consumed of node.consumes) {
          if (allProduced.has(consumed) && !producedSoFar.has(consumed)) {
            ready = false;
            continue;
          }
        }
        if (ready) {
          nodesToProcess.push(node);
        }
      }

      for (const node of nodesToProcess) {
        waiting.delete(node);
      }

      if (nodesToProcess.length === 0 && inFlight === 0) {
        // We expect the caller to check for circular dependencies before
        // traversal, so this error should never happen
        throw new Error('Circular dependency detected');
      }

      await Promise.all(nodesToProcess.map(processNode));
    }

    async function processNode(node: Node) {
      visited.add(node.id);
      inFlight += 1;
      try {
        const result = await fn(node.id);
        results.push(result);
      } catch (error) {
        throw new ForwardedError(`Failed at ${node.id}`, error);
      }
      node.produces.forEach(produced => producedSoFar.add(produced));
      inFlight -= 1;
      await processMoreNodes();
    }

    await processMoreNodes();

    return results;
  }
}
