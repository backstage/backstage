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
  OpaqueCliModule,
} from '@internal/cli';
import { CliCommand, CliModule } from './types';

/**
 * A sparse graph of commands.
 */
export class CommandGraph {
  private graph: CommandNode[] = [];

  /**
   * Adds a command to the graph. The graph is sparse, so we use the path to determine the nodes
   *    to traverse. Only leaf nodes should have a command/action.
   */
  add(command: CliCommand, module?: CliModule) {
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
          formatConflictError(
            path,
            module,
            OpaqueCommandLeafNode.toInternal(next).module,
          ),
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
        formatConflictError(
          path,
          module,
          OpaqueCommandLeafNode.toInternal(last).module,
        ),
      );
    } else {
      current.push(
        OpaqueCommandLeafNode.createInstance('v1', {
          name: lastName,
          command,
          module,
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

function getModuleName(module?: CliModule): string | undefined {
  if (module && OpaqueCliModule.isType(module)) {
    return OpaqueCliModule.toInternal(module).packageName;
  }
  return undefined;
}

function formatConflictError(
  path: string[],
  newModule?: CliModule,
  existingModule?: CliModule,
): string {
  const cmd = path.join(' ');
  const newPkg = getModuleName(newModule);
  const existingPkg = getModuleName(existingModule);
  if (newPkg && existingPkg) {
    return `Command "${cmd}" from "${newPkg}" conflicts with an existing command from "${existingPkg}"`;
  }
  if (newPkg) {
    return `Command "${cmd}" from "${newPkg}" conflicts with an existing command`;
  }
  if (existingPkg) {
    return `Command "${cmd}" conflicts with an existing command from "${existingPkg}"`;
  }
  return `Command "${cmd}" conflicts with an existing command`;
}
