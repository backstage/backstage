/*
 * Copyright 2026 The Backstage Authors
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
  OpaqueCliModule,
  OpaqueCommandLeafNode,
  OpaqueCommandTreeNode,
} from '@internal/cli';
import type { CommandNode } from '@internal/cli';
import type { CliCommand, CliModule } from './types';

export class CommandGraph {
  readonly #roots: CommandNode[] = [];

  get roots(): ReadonlyArray<CommandNode> {
    return this.#roots;
  }

  add(command: CliCommand, module: CliModule): void {
    const { path } = command;
    let current = this.#roots;

    for (let i = 0; i < path.length - 1; i++) {
      const name = path[i];
      let next = current.find(node => getNodeName(node) === name);

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

    const name = path[path.length - 1];
    const existing = current.find(node => getNodeName(node) === name);
    if (existing) {
      throw new Error(
        formatConflictError(path, module, findNodeModule(existing)),
      );
    }

    current.push(
      OpaqueCommandLeafNode.createInstance('v1', {
        name,
        command,
        module,
      }),
    );
  }
}

function getNodeName(node: CommandNode): string {
  if (OpaqueCommandTreeNode.isType(node)) {
    return OpaqueCommandTreeNode.toInternal(node).name;
  }
  return OpaqueCommandLeafNode.toInternal(node).name;
}

function findNodeModule(node: CommandNode): CliModule | undefined {
  if (OpaqueCommandLeafNode.isType(node)) {
    return OpaqueCommandLeafNode.toInternal(node).module;
  }

  for (const child of OpaqueCommandTreeNode.toInternal(node).children) {
    const module = findNodeModule(child);
    if (module) {
      return module;
    }
  }

  return undefined;
}

function getModuleName(module?: CliModule): string | undefined {
  if (module && OpaqueCliModule.isType(module)) {
    return OpaqueCliModule.toInternal(module).packageName;
  }
  return undefined;
}

function formatConflictError(
  path: string[],
  newModule: CliModule,
  existingModule?: CliModule,
): string {
  const command = path.join(' ');
  const newPackage = getModuleName(newModule);
  const existingPackage = getModuleName(existingModule);

  if (newPackage && existingPackage) {
    return `Command "${command}" from "${newPackage}" conflicts with an existing command from "${existingPackage}"`;
  }
  if (newPackage) {
    return `Command "${command}" from "${newPackage}" conflicts with an existing command`;
  }
  if (existingPackage) {
    return `Command "${command}" conflicts with an existing command from "${existingPackage}"`;
  }
  return `Command "${command}" conflicts with an existing command`;
}
