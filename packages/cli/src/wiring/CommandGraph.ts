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
import {
  CommandNode,
  OpaqueCommandTreeNode,
  OpaqueCommandLeafNode,
} from '@internal/cli';
import { CliCommand } from './types';

/**
 * A sparse graph of commands.
 */
export class CommandGraph {
  private graph: CommandNode[] = [];

  /**
   * Adds a command to the graph. The graph is sparse, so we use the path to determine the nodes
   *    to traverse. Only leaf nodes should have a command/action.
   */
  add(command: CliCommand) {
    const path = command.path;
    let current = this.graph;
    for (let i = 0; i < path.length - 1; i++) {
      const name = path[i];
      let next = current.find(
        n =>
          (OpaqueCommandTreeNode.isType(n) &&
            OpaqueCommandTreeNode.toInternal(n).name === name) ||
          (OpaqueCommandLeafNode.isType(n) &&
            OpaqueCommandLeafNode.toInternal(n).name === name),
      );
      if (!next) {
        next = OpaqueCommandTreeNode.createInstance('v1', {
          name,
          children: [],
        });
        current.push(next);
      } else if (OpaqueCommandLeafNode.isType(next)) {
        throw new Error(
          `Command already exists at path: "${path.slice(0, i).join(' ')}"`,
        );
      }
      current = OpaqueCommandTreeNode.toInternal(next).children;
    }
    const lastName = path[path.length - 1];
    const last = current.find(n => {
      if (OpaqueCommandTreeNode.isType(n)) {
        return OpaqueCommandTreeNode.toInternal(n).name === lastName;
      }
      return OpaqueCommandLeafNode.toInternal(n).name === lastName;
    });
    if (last && OpaqueCommandLeafNode.isType(last)) {
      throw new Error(
        `Command already exists at path: "${path.slice(0, -1).join(' ')}"`,
      );
    } else {
      current.push(
        OpaqueCommandLeafNode.createInstance('v1', {
          name: lastName,
          command,
        }),
      );
    }
  }

  /**
   * Given a path, try to find a command that matches it.
   */
  find(path: string[]): CliCommand | undefined {
    let current = this.graph;
    for (let i = 0; i < path.length - 1; i++) {
      const name = path[i];
      const next = current.find(n => {
        if (OpaqueCommandTreeNode.isType(n)) {
          return OpaqueCommandTreeNode.toInternal(n).name === name;
        }
        return OpaqueCommandLeafNode.toInternal(n).name === name;
      });
      if (!next || OpaqueCommandLeafNode.isType(next)) {
        return undefined;
      }
      current = OpaqueCommandTreeNode.toInternal(next).children;
    }
    const lastName = path[path.length - 1];
    const last = current.find(n => {
      if (OpaqueCommandTreeNode.isType(n)) {
        return OpaqueCommandTreeNode.toInternal(n).name === lastName;
      }
      return OpaqueCommandLeafNode.toInternal(n).name === lastName;
    });
    if (!last || OpaqueCommandTreeNode.isType(last)) {
      return undefined;
    }
    return OpaqueCommandLeafNode.toInternal(last).command;
  }

  atDepth(depth: number): CommandNode[] {
    let current = this.graph;
    for (let i = 0; i < depth; i++) {
      current = current.flatMap(n =>
        OpaqueCommandTreeNode.isType(n)
          ? OpaqueCommandTreeNode.toInternal(n).children
          : [],
      );
    }
    return current;
  }
}
