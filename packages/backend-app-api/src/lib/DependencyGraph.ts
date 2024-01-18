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

interface NodeInput<T> {
  value: T;
  consumes?: Iterable<string>;
  provides?: Iterable<string>;
}

/** @internal */
class Node<T> {
  static from<T>(input: NodeInput<T>) {
    return new Node<T>(
      input.value,
      input.consumes ? new Set(input.consumes) : new Set(),
      input.provides ? new Set(input.provides) : new Set(),
    );
  }

  private constructor(
    readonly value: T,
    readonly consumes: Set<string>,
    readonly provides: Set<string>,
  ) {}
}

/** @internal */
class CycleKeySet<T> {
  static from<T>(nodes: Array<Node<T>>) {
    return new CycleKeySet<T>(nodes);
  }

  #nodeIds: Map<T, number>;
  #cycleKeys: Set<string>;

  private constructor(nodes: Array<Node<T>>) {
    this.#nodeIds = new Map(nodes.map((n, i) => [n.value, i]));
    this.#cycleKeys = new Set<string>();
  }

  tryAdd(path: T[]): boolean {
    const cycleKey = this.#getCycleKey(path);
    if (this.#cycleKeys.has(cycleKey)) {
      return false;
    }
    this.#cycleKeys.add(cycleKey);
    return true;
  }

  #getCycleKey(path: T[]): string {
    return path
      .map(n => this.#nodeIds.get(n)!)
      .sort()
      .join(',');
  }
}

/**
 * Internal helper to help validate and traverse a dependency graph.
 * @internal
 */
export class DependencyGraph<T> {
  static fromMap(
    nodes: Record<string, Omit<NodeInput<unknown>, 'value'>>,
  ): DependencyGraph<string> {
    return this.fromIterable(
      Object.entries(nodes).map(([key, node]) => ({
        value: String(key),
        ...node,
      })),
    );
  }

  static fromIterable<T>(
    nodeInputs: Iterable<NodeInput<T>>,
  ): DependencyGraph<T> {
    const nodes = new Array<Node<T>>();
    for (const nodeInput of nodeInputs) {
      nodes.push(Node.from(nodeInput));
    }

    return new DependencyGraph(nodes);
  }

  #nodes: Array<Node<T>>;
  #allProvided: Set<string>;

  private constructor(nodes: Array<Node<T>>) {
    this.#nodes = nodes;
    this.#allProvided = new Set();

    for (const node of this.#nodes.values()) {
      for (const produced of node.provides) {
        this.#allProvided.add(produced);
      }
    }
  }

  /**
   * Find all nodes that consume dependencies that are not provided by any other node.
   */
  findUnsatisfiedDeps(): Array<{ value: T; unsatisfied: string[] }> {
    const unsatisfiedDependencies = [];
    for (const node of this.#nodes.values()) {
      const unsatisfied = Array.from(node.consumes).filter(
        id => !this.#allProvided.has(id),
      );
      if (unsatisfied.length > 0) {
        unsatisfiedDependencies.push({ value: node.value, unsatisfied });
      }
    }
    return unsatisfiedDependencies;
  }

  /**
   * Detect the first circular dependency within the graph, returning the path of nodes that
   * form a cycle, with the same node as the first and last element of the array.
   */
  detectCircularDependency(): T[] | undefined {
    return this.detectCircularDependencies().next().value;
  }

  /**
   * Detect circular dependencies within the graph, returning the path of nodes that
   * form a cycle, with the same node as the first and last element of the array.
   */
  *detectCircularDependencies(): Generator<T[], undefined> {
    const cycleKeys = CycleKeySet.from(this.#nodes);

    for (const startNode of this.#nodes) {
      const visited = new Set<Node<T>>();
      const stack = new Array<[node: Node<T>, path: T[]]>([
        startNode,
        [startNode.value],
      ]);

      while (stack.length > 0) {
        const [node, path] = stack.pop()!;
        if (visited.has(node)) {
          continue;
        }
        visited.add(node);
        for (const consumed of node.consumes) {
          const providerNodes = this.#nodes.filter(other =>
            other.provides.has(consumed),
          );
          for (const provider of providerNodes) {
            if (provider === startNode) {
              if (cycleKeys.tryAdd(path)) {
                yield [...path, startNode.value];
              }

              break;
            }
            if (!visited.has(provider)) {
              stack.push([provider, [...path, provider.value]]);
            }
          }
        }
      }
    }
    return undefined;
  }

  /**
   * Traverses the dependency graph in topological order, calling the provided
   * function for each node and waiting for it to resolve.
   *
   * The nodes are traversed in parallel, but in such a way that no node is
   * visited before all of its dependencies.
   *
   * Dependencies of nodes that are not produced by any other nodes will be ignored.
   */
  async parallelTopologicalTraversal<TResult>(
    fn: (value: T) => Promise<TResult>,
  ): Promise<TResult[]> {
    const allProvided = this.#allProvided;
    const producedSoFar = new Set<string>();
    const waiting = new Set(this.#nodes.values());
    const visited = new Set<Node<T>>();
    const results = new Array<TResult>();
    let inFlight = 0; // Keep track of how many callbacks are in flight, so that we know if we got stuck

    // Find all nodes that have no dependencies that have not already been produced by visited nodes
    async function processMoreNodes() {
      if (waiting.size === 0) {
        return;
      }
      const nodesToProcess = [];
      for (const node of waiting) {
        let ready = true;
        for (const consumed of node.consumes) {
          if (allProvided.has(consumed) && !producedSoFar.has(consumed)) {
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

    // Process an individual node, and then add its produced dependencies to the set of available products
    async function processNode(node: Node<T>) {
      visited.add(node);
      inFlight += 1;

      const result = await fn(node.value);
      results.push(result);

      node.provides.forEach(produced => producedSoFar.add(produced));
      inFlight -= 1;
      await processMoreNodes();
    }

    await processMoreNodes();

    return results;
  }
}
