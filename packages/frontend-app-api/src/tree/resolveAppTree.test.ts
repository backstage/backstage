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

import {
  coreExtensionData,
  createExtension,
  createExtensionInput,
  Extension,
} from '@backstage/frontend-plugin-api';
import { resolveAppTree } from './resolveAppTree';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveExtensionDefinition } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';

const extension = resolveExtensionDefinition(
  createExtension({
    name: 'test',
    attachTo: { id: 'nonexistent', input: 'nonexistent' },
    output: [],
    factory: () => [],
  }),
) as Extension<unknown, unknown>;

const baseSpec = {
  extension,
  attachTo: { id: 'nonexistent', input: 'nonexistent' },
  disabled: false,
};

describe('buildAppTree', () => {
  it('should fail to create an empty tree', () => {
    expect(() => resolveAppTree('app', [])).toThrow(
      "No root node with id 'app' found in app tree",
    );
  });

  it('should create a tree with only one node', () => {
    const tree = resolveAppTree('app', [{ ...baseSpec, id: 'app' }]);
    expect(tree.root).toEqual({
      spec: { ...baseSpec, id: 'app' },
      edges: { attachments: new Map() },
    });
    expect(Array.from(tree.orphans)).toEqual([]);
    expect(Array.from(tree.nodes.keys())).toEqual(['app']);
  });

  it('should create a tree', () => {
    const tree = resolveAppTree('b', [
      { ...baseSpec, id: 'a' },
      { ...baseSpec, id: 'b' },
      { ...baseSpec, id: 'c' },
      { ...baseSpec, attachTo: { id: 'b', input: 'x' }, id: 'bx1' },
      { ...baseSpec, attachTo: { id: 'b', input: 'x' }, id: 'bx2' },
      { ...baseSpec, attachTo: { id: 'b', input: 'y' }, id: 'by1' },
      { ...baseSpec, attachTo: { id: 'd', input: 'x' }, id: 'dx1' },
    ]);

    expect(Array.from(tree.nodes.keys())).toEqual([
      'a',
      'b',
      'c',
      'bx1',
      'bx2',
      'by1',
      'dx1',
    ]);

    expect(JSON.parse(JSON.stringify(tree.root))).toMatchInlineSnapshot(`
      {
        "attachments": {
          "x": [
            {
              "id": "bx1",
            },
            {
              "id": "bx2",
            },
          ],
          "y": [
            {
              "id": "by1",
            },
          ],
        },
        "id": "b",
      }
    `);
    expect(String(tree.root)).toMatchInlineSnapshot(`
      "<b>
        x [
          <bx1 />
          <bx2 />
        ]
        y [
          <by1 />
        ]
      </b>"
    `);

    const orphans = Array.from(tree.orphans).map(String);
    expect(orphans).toMatchInlineSnapshot(`
      [
        "<a />",
        "<c />",
        "<dx1 />",
      ]
    `);
  });

  it('should create a tree with clones', () => {
    const tree = resolveAppTree('a', [
      { ...baseSpec, id: 'a' },
      { ...baseSpec, id: 'b', attachTo: { id: 'a', input: 'x' } },
      {
        ...baseSpec,
        id: 'c',
        attachTo: [
          { id: 'a', input: 'x' },
          { id: 'b', input: 'x' },
        ],
      },
      {
        ...baseSpec,
        id: 'd',
        attachTo: [
          { id: 'b', input: 'x' },
          { id: 'c', input: 'x' },
        ],
      },
    ]);

    expect(Array.from(tree.nodes.keys())).toEqual(['a', 'b', 'c', 'd']);

    expect(String(tree.root)).toMatchInlineSnapshot(`
      "<a>
        x [
          <b>
            x [
              <c>
                x [
                  <d />
                ]
              </c>
              <d />
            ]
          </b>
          <c>
            x [
              <d />
            ]
          </c>
        ]
      </a>"
    `);

    const orphans = Array.from(tree.orphans).map(String);
    expect(orphans).toMatchInlineSnapshot(`[]`);
  });

  it('should create a tree out of order', () => {
    const tree = resolveAppTree('b', [
      { ...baseSpec, attachTo: { id: 'b', input: 'x' }, id: 'bx2' },
      { ...baseSpec, id: 'a' },
      { ...baseSpec, attachTo: { id: 'b', input: 'y' }, id: 'by1' },
      { ...baseSpec, id: 'b' },
      { ...baseSpec, attachTo: { id: 'b', input: 'x' }, id: 'bx1' },
      { ...baseSpec, id: 'c' },
      { ...baseSpec, attachTo: { id: 'd', input: 'x' }, id: 'dx1' },
    ]);

    expect(Array.from(tree.nodes.keys())).toEqual([
      'bx2',
      'a',
      'by1',
      'b',
      'bx1',
      'c',
      'dx1',
    ]);

    expect(String(tree.root)).toMatchInlineSnapshot(`
      "<b>
        x [
          <bx2 />
          <bx1 />
        ]
        y [
          <by1 />
        ]
      </b>"
    `);

    const orphans = Array.from(tree.orphans).map(String);
    expect(orphans).toMatchInlineSnapshot(`
      [
        "<a />",
        "<c />",
        "<dx1 />",
      ]
    `);
  });

  it('throws an error when duplicated extensions are detected', () => {
    expect(() =>
      resolveAppTree('app', [
        { ...baseSpec, id: 'a' },
        { ...baseSpec, id: 'a' },
      ]),
    ).toThrow("Unexpected duplicate extension id 'a'");
  });

  describe('redirects', () => {
    it('should throw an error when theres a duplicate redirect target', () => {
      const e1 = resolveExtensionDefinition(
        createExtension({
          name: 'test',
          attachTo: { id: 'nonexistent', input: 'nonexistent' },
          inputs: {
            test: createExtensionInput([coreExtensionData.reactElement], {
              replaces: [{ id: 'a', input: 'test' }],
            }),
          },
          output: [],
          factory: () => [],
        }),
      ) as Extension<unknown, unknown>;

      const e2 = resolveExtensionDefinition(
        createExtension({
          name: 'test-2',
          attachTo: { id: 'nonexistent', input: 'nonexistent' },
          inputs: {
            test: createExtensionInput([coreExtensionData.reactElement], {
              replaces: [{ id: 'a', input: 'test' }],
            }),
          },
          output: [],
          factory: () => [],
        }),
      ) as Extension<unknown, unknown>;

      expect(() =>
        resolveAppTree('a', [
          { ...baseSpec, id: 'a', extension: e1 },
          { ...baseSpec, id: 'b', extension: e2 },
        ]),
      ).toThrow("Duplicate redirect target for input 'test' in extension 'b'");
    });

    it('should set the correct attachment point for a redirect', () => {
      const e1 = resolveExtensionDefinition(
        createExtension({
          name: 'test',
          attachTo: { id: 'nonexistent', input: 'nonexistent' },
          inputs: {
            test: createExtensionInput([coreExtensionData.reactElement], {
              replaces: [{ id: 'replace', input: 'me' }],
            }),
          },
          output: [],
          factory: () => [],
        }),
      ) as Extension<unknown, unknown>;

      const e2 = resolveExtensionDefinition(
        createExtension({
          name: 'test-2',
          attachTo: { id: 'replace', input: 'me' },
          output: [],
          factory: () => [],
        }),
      ) as Extension<unknown, unknown>;

      const tree = resolveAppTree('a', [
        { attachTo: e1.attachTo, id: 'a', extension: e1, disabled: false },
        { attachTo: e2.attachTo, id: 'b', extension: e2, disabled: false },
      ]);

      expect(tree.root).toMatchInlineSnapshot(`
              {
                "attachments": {
                  "test": [
                    {
                      "attachments": undefined,
                      "id": "b",
                      "output": undefined,
                    },
                  ],
                },
                "id": "a",
                "output": undefined,
              }
          `);

      expect(tree.orphans).toMatchInlineSnapshot(`[]`);

      expect(String(tree.root)).toMatchInlineSnapshot(`
              "<a>
                test [
                  <b />
                ]
              </a>"
          `);
    });

    it('should not allow redirects for attachment points that already exist', () => {
      const e1 = resolveExtensionDefinition(
        createExtension({
          name: 'test',
          attachTo: { id: 'a', input: 'a' },
          inputs: {
            test: createExtensionInput([coreExtensionData.reactElement], {
              replaces: [{ id: 'test-2', input: 'test' }],
            }),
          },
          output: [],
          factory: () => [],
        }),
      ) as Extension<unknown, unknown>;

      const e2 = resolveExtensionDefinition(
        createExtension({
          name: 'test-2',
          attachTo: { id: 'b', input: 'b' },
          inputs: {
            test: createExtensionInput([coreExtensionData.reactElement]),
          },
          output: [],
          factory: () => [],
        }),
      ) as Extension<unknown, unknown>;

      const e3 = resolveExtensionDefinition(
        createExtension({
          name: 'test-3',
          attachTo: { id: 'test-2', input: 'test' },
          output: [],
          factory: () => [],
        }),
      ) as Extension<unknown, unknown>;

      const tree = resolveAppTree('test-2', [
        { attachTo: e1.attachTo, id: e1.id, extension: e1, disabled: false },
        { attachTo: e2.attachTo, id: e2.id, extension: e2, disabled: false },
        { attachTo: e3.attachTo, id: e3.id, extension: e3, disabled: false },
      ]);

      expect(tree.nodes.get('test-3')?.edges.attachedTo?.node).toBe(
        tree.nodes.get('test-2'),
      );
    });
  });
});
