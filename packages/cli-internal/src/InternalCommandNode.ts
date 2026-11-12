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

import { CliCommand, CliModule } from '@backstage/cli-node';
import { OpaqueType } from '@internal/opaque';

/** @internal */
export interface CommandTreeNode {
  readonly $$type: '@backstage/CommandTreeNode';
}

/** @internal */
export interface CommandLeafNode {
  readonly $$type: '@backstage/CommandLeafNode';
}

export type CommandNode = CommandTreeNode | CommandLeafNode;

export const OpaqueCommandTreeNode = OpaqueType.create<{
  public: CommandTreeNode;
  versions: {
    readonly version: 'v1';
    readonly name: string;
    readonly children: CommandNode[];
  };
}>({
  type: '@backstage/CommandTreeNode',
  versions: ['v1'],
});

/**
 * A single implementation of a command path, along with the module that
 * provided it.
 */
export interface CommandLeafVariant {
  readonly command: CliCommand;
  readonly module?: CliModule;
}

export const OpaqueCommandLeafNode = OpaqueType.create<{
  public: CommandLeafNode;
  versions: {
    readonly version: 'v1';
    readonly name: string;
    /**
     * All implementations registered for this command path. There is always
     * at least one variant. Multiple variants are only present for toggleable
     * commands, where at most one variant lacks an `isEnabled` predicate.
     */
    readonly variants: CommandLeafVariant[];
  };
}>({
  type: '@backstage/CommandLeafNode',
  versions: ['v1'],
});

/**
 * Checks whether a command node should be hidden from help output.
 * Leaf nodes are hidden if all of their variants are deprecated or experimental.
 * Tree nodes are hidden if all of their children are hidden.
 */
export function isCommandNodeHidden(node: CommandNode): boolean {
  if (OpaqueCommandLeafNode.isType(node)) {
    const { variants } = OpaqueCommandLeafNode.toInternal(node);
    return variants.every(
      ({ command }) => !!command.deprecated || !!command.experimental,
    );
  }
  const { children } = OpaqueCommandTreeNode.toInternal(node);
  return children.every(child => isCommandNodeHidden(child));
}
