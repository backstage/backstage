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

import yargs from 'yargs';
import { ZodObject, ZodRawShape } from 'zod';

interface BackstageCommand<T extends ZodRawShape = ZodRawShape> {
  path: string[];
  description: string;
  schema: ZodObject<T>;
  execute: (options: T) => Promise<void>;
}

type Node<T extends ZodRawShape = ZodRawShape> = TreeNode | LeafNode<T>;

interface TreeNode {
  type: '$$treeNode';
  name: string;
  children: TreeNode[];
}

interface LeafNode<T extends ZodRawShape> {
  type: '$$leafNode';
  name: string;
  command: BackstageCommand<T>;
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
  add<T extends ZodRawShape>(command: BackstageCommand<T>) {
    const path = command.path;
    let current = this.graph;
    for (let i = 0; i < path.length - 1; i++) {
      const name = path[i];
      let next = current.find(n => n.name === name);
      if (!next) {
        next = { type: '$$treeNode', name, children: [] };
        current.push(next);
      } else if (next.type === '$$leafNode') {
        throw new Error(
          `Command already exists at path: "${path.slice(0, i).join(' ')}"`,
        );
      }
      current = next.children;
    }
    const last = current.find(n => n.name === path[path.length - 1]) as Node<T>;
    if (last && last.type === '$$leafNode') {
      throw new Error(
        `Command already exists at path: "${path.slice(0, -1).join(' ')}"`,
      );
    } else {
      current.push({
        type: '$$leafNode',
        name: path[path.length - 1],
        command,
      } as Node<any>);
    }
  }

  /**
   * Given a path, try to find a command that matches it.
   */
  find<T extends ZodRawShape>(path: string[]): BackstageCommand<T> | undefined {
    let current = this.graph;
    for (let i = 0; i < path.length - 1; i++) {
      const name = path[i];
      const next = current.find(n => n.name === name);
      if (!next) {
        return undefined;
      } else if (next.type === '$$leafNode') {
        return undefined;
      }
      current = next.children;
    }
    const last = current.find(n => n.name === path[path.length - 1]) as Node<T>;
    if (!last || last.type === '$$treeNode') {
      return undefined;
    }
    return last?.command;
  }
}

export class CliInitializer {
  private graph = new CommandGraph();

  /**
   * Add a command to the CLI. This will be mostly used to prevent command overlaps
   *    and to create `help` commands.
   */
  addCommand<T extends ZodRawShape>(command: BackstageCommand<T>) {
    this.graph.add(command);
  }

  /**
   * Actually parse argv and pass it to the command.
   */
  async run() {
    const {
      _: commandName,
      $0: binaryName,
      ...options
    } = await yargs(process.argv.slice(2)).parse();
    const command = this.graph.find(commandName.map(String));
    if (!command) {
      console.error(`Command not found: "${commandName.join(' ')}"`);
      process.exit(1);
    }
    const parsedOptions = command.schema.parse(options);
    await command?.execute(parsedOptions);
  }
}
