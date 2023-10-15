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

import { createExtension } from '@backstage/frontend-plugin-api';
import { buildAppGraph } from './buildAppGraph';

const extBaseConfig = {
  id: 'test',
  attachTo: { id: 'root', input: 'default' },
  output: {},
  factory() {},
};

const extension = createExtension(extBaseConfig);

const baseSpec = { extension, disabled: false };

describe('buildAppGraph', () => {
  it('creates an empty graph', () => {
    const graph = buildAppGraph([]);
    expect([...graph.rootNodes.keys()]).toEqual([]);
    expect([...graph.orphanNodes.keys()]).toEqual([]);
  });

  it('should create a graph', () => {
    const graph = buildAppGraph([
      { ...baseSpec, id: 'a' },
      { ...baseSpec, id: 'b' },
      { ...baseSpec, id: 'c' },
      { ...baseSpec, attachTo: { id: 'b', input: 'x' }, id: 'bx1' },
      { ...baseSpec, attachTo: { id: 'b', input: 'x' }, id: 'bx2' },
      { ...baseSpec, attachTo: { id: 'b', input: 'y' }, id: 'by1' },
      { ...baseSpec, attachTo: { id: 'd', input: 'x' }, id: 'dx1' },
    ]);
    expect([...graph.rootNodes.keys()]).toEqual(['a', 'b', 'c']);
    expect([...graph.orphanNodes.keys()]).toEqual(['dx1']);
  });

  it('should create a graph out of order', () => {
    const graph = buildAppGraph([
      { ...baseSpec, attachTo: { id: 'b', input: 'x' }, id: 'bx2' },
      { ...baseSpec, id: 'a' },
      { ...baseSpec, attachTo: { id: 'b', input: 'y' }, id: 'by1' },
      { ...baseSpec, id: 'b' },
      { ...baseSpec, attachTo: { id: 'b', input: 'x' }, id: 'bx1' },
      { ...baseSpec, id: 'c' },
      { ...baseSpec, attachTo: { id: 'd', input: 'x' }, id: 'dx1' },
    ]);
    expect([...graph.rootNodes.keys()]).toEqual(['a', 'b', 'c']);
    expect([...graph.orphanNodes.keys()]).toEqual(['dx1']);
  });

  it('throws an error when duplicated extensions are detected', () => {
    expect(() =>
      buildAppGraph([
        { ...baseSpec, id: 'a' },
        { ...baseSpec, id: 'a' },
      ]),
    ).toThrow("Unexpected duplicate extension id 'a'");
  });
});
