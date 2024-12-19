/*
 * Copyright 2024 The Backstage Authors
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
import { BackstageCommand } from '../types';

type Node = TreeNode | LeafNode;

interface TreeNode {
  $$type: '@tree/root';
  name: string;
  children: TreeNode[];
}

interface LeafNode {
  $$type: '@tree/leaf';
  name: string;
  command: BackstageCommand;
}

/**
 * A sparse graph of commands.
 */
export class CommandGraph {
  private graph: Node[] = [];

  /**
   * Adds a command to the graph. The graph is sparse, so we use the path to determine the nodes
   *    to traverse. Only leaf nodes should have a command/action.
   */
  add(command: BackstageCommand) {
    const path = command.path;
    let current = this.graph;
    for (let i = 0; i < path.length - 1; i++) {
      const name = path[i];
      let next = current.find(n => n.name === name);
      if (!next) {
        next = { $$type: '@tree/root', name, children: [] };
        current.push(next);
      } else if (next.$$type === '@tree/leaf') {
        throw new Error(
          `Command already exists at path: "${path.slice(0, i).join(' ')}"`,
        );
      }
      current = next.children;
    }
    const last = current.find(n => n.name === path[path.length - 1]);
    if (last && last.$$type === '@tree/leaf') {
      throw new Error(
        `Command already exists at path: "${path.slice(0, -1).join(' ')}"`,
      );
    } else {
      current.push({
        $$type: '@tree/leaf',
        name: path[path.length - 1],
        command,
      });
    }
  }

  /**
   * Given a path, try to find a command that matches it.
   */
  find(path: string[]): BackstageCommand | undefined {
    let current = this.graph;
    for (let i = 0; i < path.length - 1; i++) {
      const name = path[i];
      const next = current.find(n => n.name === name);
      if (!next) {
        return undefined;
      } else if (next.$$type === '@tree/leaf') {
        return undefined;
      }
      current = next.children;
    }
    const last = current.find(n => n.name === path[path.length - 1]);
    if (!last || last.$$type === '@tree/root') {
      return undefined;
    }
    return last?.command;
  }

  atDepth(depth: number): Node[] {
    let current = this.graph;
    for (let i = 0; i < depth; i++) {
      current = current.flatMap(n =>
        n.$$type === '@tree/root' ? n.children : [],
      );
    }
    return current;
  }
}
