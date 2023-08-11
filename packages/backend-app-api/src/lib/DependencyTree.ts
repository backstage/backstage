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

import { ConflictError, InputError } from '@backstage/errors';

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
  #producedBy: Map<string, string>;
  #consumedBy: Map<string, Set<string>>;

  private constructor(readonly nodes: Map<string, Node>) {
    this.#allProduced = new Set();
    this.#allConsumed = new Set();
    this.#producedBy = new Map();
    this.#consumedBy = new Map();

    for (const node of this.nodes.values()) {
      for (const produced of node.produces) {
        this.#allProduced.add(produced);
        if (this.#producedBy.has(produced)) {
          throw new ConflictError(
            `Dependency conflict detected, '${produced}' may not be produced by both '${this.#producedBy.get(
              produced,
            )}' and '${node.id}'`,
          );
        }
        this.#producedBy.set(produced, node.id);
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
}
