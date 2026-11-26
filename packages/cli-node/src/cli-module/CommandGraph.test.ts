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
  OpaqueCliPackageCommand,
  OpaqueCommandLeafNode,
  OpaqueCommandTreeNode,
  isCommandNodeHidden,
} from '@internal/cli';
import { CommandGraph } from './CommandGraph';
import { createCliModule } from './createCliModule';
import type { CliCommand } from './types';
import type { CliPackageContext } from './types';

const moduleA = createCliModule({
  packageJson: { name: '@example/a' },
  init: async () => {},
});
const moduleB = createCliModule({
  packageJson: { name: '@example/b' },
  init: async () => {},
});
const moduleC = createCliModule({
  packageJson: { name: '@example/c' },
  init: async () => {},
});

type Condition = (context: CliPackageContext) => boolean;

function testCommand(overrides: Partial<CliCommand> = {}): CliCommand {
  return {
    path: ['package', 'test'],
    description: 'Test the package',
    execute: async () => {},
    ...overrides,
  };
}

function packageTest(overrides: Partial<CliCommand> & { if?: Condition } = {}) {
  const { if: condition, ...rest } = overrides;
  const command = testCommand(rest);
  return {
    command,
    if: condition,
    entry: OpaqueCliPackageCommand.createInstance('v1', {
      command,
      if: condition,
    }),
  };
}

function getLeafVariants(graph: CommandGraph) {
  const [packageNode] = graph.roots;
  const [leaf] = OpaqueCommandTreeNode.toInternal(packageNode).children;
  return OpaqueCommandLeafNode.toInternal(leaf).variants;
}

describe('CommandGraph', () => {
  it('collects toggleable variants alongside at most one fallback', () => {
    const graph = new CommandGraph();
    const toggledA = packageTest({ if: () => true });
    const fallback = packageTest();
    const toggledC = packageTest({ if: () => false });

    graph.add(toggledA.entry, moduleA);
    graph.add(fallback.entry, moduleB);
    graph.add(toggledC.entry, moduleC);

    expect(graph.roots).toHaveLength(1);
    expect(getLeafVariants(graph)).toEqual([
      { command: toggledA.command, if: toggledA.if, module: moduleA },
      { command: fallback.command, if: undefined, module: moduleB },
      { command: toggledC.command, if: toggledC.if, module: moduleC },
    ]);
  });

  it('rejects a second variant without if', () => {
    const graph = new CommandGraph();
    graph.add(packageTest({ if: () => true }).entry, moduleA);
    graph.add(packageTest().entry, moduleB);

    expect(() => graph.add(packageTest().entry, moduleC)).toThrow(
      'Command "package test" from "@example/c" conflicts with an existing command from "@example/b"',
    );
    expect(getLeafVariants(graph)).toHaveLength(2);
  });

  it('rejects commands nested below a toggleable leaf', () => {
    const graph = new CommandGraph();
    graph.add(packageTest({ if: () => true }).entry, moduleA);

    expect(() =>
      graph.add(
        packageTest({ path: ['package', 'test', 'deep'] }).entry,
        moduleB,
      ),
    ).toThrow(
      'Command "package test deep" from "@example/b" conflicts with an existing command from "@example/a"',
    );
  });

  it('hides a leaf only when all of its variants are hidden', () => {
    const graph = new CommandGraph();
    graph.add(packageTest({ experimental: true }).entry, moduleA);
    const [packageNode] = graph.roots;
    expect(isCommandNodeHidden(packageNode)).toBe(true);

    graph.add(packageTest({ if: () => true }).entry, moduleB);
    expect(isCommandNodeHidden(packageNode)).toBe(false);
  });
});
