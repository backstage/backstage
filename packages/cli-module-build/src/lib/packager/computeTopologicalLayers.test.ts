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

import { PackageGraphNode } from '@backstage/cli-node';
import { computeTopologicalLayers } from './computeTopologicalLayers';

function makeNode(
  name: string,
  deps: PackageGraphNode[] = [],
): PackageGraphNode {
  return {
    name,
    dir: `/packages/${name}`,
    packageJson: { name, version: '1.0.0' },
    allLocalDependencies: new Map(),
    publishedLocalDependencies: new Map(deps.map(d => [d.name, d])),
    localDependencies: new Map(),
    localDevDependencies: new Map(),
    localOptionalDependencies: new Map(),
    allLocalDependents: new Map(),
    publishedLocalDependents: new Map(),
    localDependents: new Map(),
    localDevDependents: new Map(),
    localOptionalDependents: new Map(),
  } as PackageGraphNode;
}

describe('computeTopologicalLayers', () => {
  it('returns an empty array for no packages', () => {
    expect(computeTopologicalLayers([])).toEqual([]);
  });

  it('returns a single layer when packages have no dependencies', () => {
    const a = makeNode('a');
    const b = makeNode('b');
    const c = makeNode('c');

    const layers = computeTopologicalLayers([a, b, c]);
    expect(layers).toHaveLength(1);
    expect(layers[0]).toEqual(expect.arrayContaining([a, b, c]));
  });

  it('separates packages into layers based on dependency order', () => {
    const a = makeNode('a');
    const b = makeNode('b', [a]);
    const c = makeNode('c', [b]);

    const layers = computeTopologicalLayers([a, b, c]);
    expect(layers).toHaveLength(3);
    expect(layers[0]).toEqual([a]);
    expect(layers[1]).toEqual([b]);
    expect(layers[2]).toEqual([c]);
  });

  it('groups independent packages into the same layer', () => {
    //   a
    //  / \
    // b   c
    //  \ /
    //   d
    const a = makeNode('a');
    const b = makeNode('b', [a]);
    const c = makeNode('c', [a]);
    const d = makeNode('d', [b, c]);

    const layers = computeTopologicalLayers([a, b, c, d]);
    expect(layers).toHaveLength(3);
    expect(layers[0]).toEqual([a]);
    expect(layers[1]).toEqual(expect.arrayContaining([b, c]));
    expect(layers[1]).toHaveLength(2);
    expect(layers[2]).toEqual([d]);
  });

  it('falls back to sequential single-package layers on circular dependencies', () => {
    const a = makeNode('a');
    const b = makeNode('b');
    // Create a cycle: a -> b -> a
    a.publishedLocalDependencies.set('b', b);
    b.publishedLocalDependencies.set('a', a);

    const layers = computeTopologicalLayers([a, b]);
    // Should pack each remaining package sequentially rather than in parallel
    expect(layers).toHaveLength(2);
    expect(layers[0]).toHaveLength(1);
    expect(layers[1]).toHaveLength(1);
    expect(layers.flat()).toEqual(expect.arrayContaining([a, b]));
  });

  it('handles a partial cycle with non-cyclic packages separated into earlier layers', () => {
    const a = makeNode('a');
    const b = makeNode('b', [a]);
    const c = makeNode('c');
    // Create cycle: b -> c -> b (but a is not in the cycle)
    b.publishedLocalDependencies.set('c', c);
    c.publishedLocalDependencies.set('b', b);

    const layers = computeTopologicalLayers([a, b, c]);
    // a has no deps, so it goes in layer 0
    expect(layers[0]).toEqual([a]);
    // b and c form a cycle, so they are packed sequentially
    expect(layers[1]).toHaveLength(1);
    expect(layers[2]).toHaveLength(1);
    expect([layers[1][0], layers[2][0]]).toEqual(
      expect.arrayContaining([b, c]),
    );
    expect(layers).toHaveLength(3);
  });

  it('produces correct layers regardless of input order', () => {
    const a = makeNode('a');
    const b = makeNode('b', [a]);
    const c = makeNode('c', [a]);

    // Reverse input order
    const layers = computeTopologicalLayers([c, b, a]);
    expect(layers).toHaveLength(2);
    expect(layers[0]).toEqual([a]);
    expect(layers[1]).toEqual(expect.arrayContaining([b, c]));
  });

  it('only considers publishedLocalDependencies, not other dependency types', () => {
    const a = makeNode('a');
    const b = makeNode('b');
    // b has a as a dev dependency but not a published dependency
    b.localDevDependencies.set('a', a);

    const layers = computeTopologicalLayers([a, b]);
    // Both should be in the same layer since published deps are empty
    expect(layers).toHaveLength(1);
    expect(layers[0]).toEqual(expect.arrayContaining([a, b]));
  });
});
