/*
 * Copyright 2025 The Backstage Authors
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

import { InMemoryCatalogClient } from '@backstage/catalog-client/testUtils';
import { traverseCatalog } from './traverseCatalog';
import { stringifyEntityRef } from '@backstage/catalog-model';

describe('traverseCatalog', () => {
  it('works for basic cases', async () => {
    const catalogApi = new InMemoryCatalogClient({
      entities: [
        {
          apiVersion: 'v',
          kind: 'k',
          metadata: { name: 'a', namespace: 'ns' },
          relations: [{ type: 'dependsOn', targetRef: 'k:ns/b' }],
        },
        {
          apiVersion: 'v',
          kind: 'k',
          metadata: { name: 'b', namespace: 'ns' },
          relations: [
            { type: 'dependsOn', targetRef: 'k:ns/c' },
            { type: 'ignoredType', targetRef: 'k:ns/d' },
          ],
        },
      ],
    });
    const traversal = traverseCatalog({
      catalogApi,
      initial: { entityRef: 'k:ns/a' },
      follow: {
        relation: 'dependsOn',
      },
    });

    await expect(traversal.toEntityRefArray()).resolves.toMatchInlineSnapshot(`
      [
        "k:ns/a",
        "k:ns/b",
        "k:ns/c",
      ]
    `);
    await expect(traversal.toEntityRefArray({ includeMissing: false })).resolves
      .toMatchInlineSnapshot(`
      [
        "k:ns/a",
        "k:ns/b",
      ]
    `);
    await expect(traversal.toEntityRefArray({ minDepth: 1 })).resolves
      .toMatchInlineSnapshot(`
      [
        "k:ns/b",
        "k:ns/c",
      ]
    `);
    await expect(traversal.toEntityRefArray({ minDepth: 1, maxDepth: 1 }))
      .resolves.toMatchInlineSnapshot(`
      [
        "k:ns/b",
      ]
    `);
    await expect(traversal.toEntityRefArray({ maxDepth: 2000000000000000 }))
      .resolves.toMatchInlineSnapshot(`
      [
        "k:ns/a",
        "k:ns/b",
        "k:ns/c",
      ]
    `);

    await expect(traversal.toEntityRefSet()).resolves.toMatchInlineSnapshot(`
      Set {
        "k:ns/a",
        "k:ns/b",
        "k:ns/c",
      }
    `);
    await expect(traversal.toEntityRefSet({ includeMissing: false })).resolves
      .toMatchInlineSnapshot(`
      Set {
        "k:ns/a",
        "k:ns/b",
      }
    `);
    await expect(traversal.toEntityRefSet({ minDepth: 1 })).resolves
      .toMatchInlineSnapshot(`
      Set {
        "k:ns/b",
        "k:ns/c",
      }
    `);
    await expect(traversal.toEntityRefSet({ minDepth: 1, maxDepth: 1 }))
      .resolves.toMatchInlineSnapshot(`
      Set {
        "k:ns/b",
      }
    `);
    await expect(traversal.toEntityRefSet({ maxDepth: 2000000000000000 }))
      .resolves.toMatchInlineSnapshot(`
      Set {
        "k:ns/a",
        "k:ns/b",
        "k:ns/c",
      }
    `);

    await expect(
      traversal.toEntityArray().then(es => es.map(stringifyEntityRef)),
    ).resolves.toMatchInlineSnapshot(`
      [
        "k:ns/a",
        "k:ns/b",
      ]
    `);

    await expect(
      traversal
        .toEntitySet()
        .then(es => new Set([...es].map(stringifyEntityRef))),
    ).resolves.toMatchInlineSnapshot(`
      Set {
        "k:ns/a",
        "k:ns/b",
      }
    `);

    await expect(traversal.toGraph()).resolves.toMatchInlineSnapshot(`
      {
        "entities": {
          "k:ns/a": {
            "apiVersion": "v",
            "kind": "k",
            "metadata": {
              "name": "a",
              "namespace": "ns",
            },
            "relations": [
              {
                "targetRef": "k:ns/b",
                "type": "dependsOn",
              },
            ],
          },
          "k:ns/b": {
            "apiVersion": "v",
            "kind": "k",
            "metadata": {
              "name": "b",
              "namespace": "ns",
            },
            "relations": [
              {
                "targetRef": "k:ns/c",
                "type": "dependsOn",
              },
              {
                "targetRef": "k:ns/d",
                "type": "ignoredType",
              },
            ],
          },
        },
        "nodes": {
          "k:ns/a": {
            "entityRef": "k:ns/a",
            "relations": [
              {
                "targetRef": "k:ns/b",
                "type": "dependsOn",
              },
            ],
          },
          "k:ns/b": {
            "entityRef": "k:ns/b",
            "relations": [
              {
                "targetRef": "k:ns/c",
                "type": "dependsOn",
              },
            ],
          },
          "k:ns/c": {
            "entityRef": "k:ns/c",
            "relations": [],
          },
        },
        "roots": [
          "k:ns/a",
        ],
      }
    `);

    await expect(traversal.toGraph({ includeMissing: false })).resolves
      .toMatchInlineSnapshot(`
      {
        "entities": {
          "k:ns/a": {
            "apiVersion": "v",
            "kind": "k",
            "metadata": {
              "name": "a",
              "namespace": "ns",
            },
            "relations": [
              {
                "targetRef": "k:ns/b",
                "type": "dependsOn",
              },
            ],
          },
          "k:ns/b": {
            "apiVersion": "v",
            "kind": "k",
            "metadata": {
              "name": "b",
              "namespace": "ns",
            },
            "relations": [
              {
                "targetRef": "k:ns/c",
                "type": "dependsOn",
              },
              {
                "targetRef": "k:ns/d",
                "type": "ignoredType",
              },
            ],
          },
        },
        "nodes": {
          "k:ns/a": {
            "entityRef": "k:ns/a",
            "relations": [
              {
                "targetRef": "k:ns/b",
                "type": "dependsOn",
              },
            ],
          },
          "k:ns/b": {
            "entityRef": "k:ns/b",
            "relations": [],
          },
        },
        "roots": [
          "k:ns/a",
        ],
      }
    `);
  });

  it('gracefully handles circularity', async () => {
    const catalogApi = new InMemoryCatalogClient({
      entities: [
        {
          apiVersion: 'v',
          kind: 'k',
          metadata: { name: 'a', namespace: 'ns' },
          relations: [{ type: 'dependsOn', targetRef: 'k:ns/b' }],
        },
        {
          apiVersion: 'v',
          kind: 'k',
          metadata: { name: 'b', namespace: 'ns' },
          relations: [
            { type: 'dependsOn', targetRef: 'k:ns/a' },
            { type: 'dependsOn', targetRef: 'k:ns/c' },
          ],
        },
      ],
    });
    const traversal = traverseCatalog({
      catalogApi,
      initial: { entityRefs: ['k:ns/a'] },
      follow: {
        relation: 'dependsOn',
      },
    });

    await expect(traversal.toEntityRefArray()).resolves.toMatchInlineSnapshot(`
      [
        "k:ns/a",
        "k:ns/b",
        "k:ns/c",
      ]
    `);
    await expect(traversal.toEntityRefArray({ includeMissing: false })).resolves
      .toMatchInlineSnapshot(`
      [
        "k:ns/a",
        "k:ns/b",
      ]
    `);
    await expect(traversal.toEntityRefArray({ minDepth: 1 })).resolves
      .toMatchInlineSnapshot(`
      [
        "k:ns/b",
        "k:ns/c",
      ]
    `);
    await expect(traversal.toEntityRefArray({ minDepth: 1, maxDepth: 1 }))
      .resolves.toMatchInlineSnapshot(`
      [
        "k:ns/b",
      ]
    `);
    await expect(traversal.toEntityRefArray({ maxDepth: 2000000000000000 }))
      .resolves.toMatchInlineSnapshot(`
      [
        "k:ns/a",
        "k:ns/b",
        "k:ns/c",
      ]
    `);

    await expect(traversal.toEntityRefSet()).resolves.toMatchInlineSnapshot(`
      Set {
        "k:ns/a",
        "k:ns/b",
        "k:ns/c",
      }
    `);
    await expect(traversal.toEntityRefSet({ includeMissing: false })).resolves
      .toMatchInlineSnapshot(`
      Set {
        "k:ns/a",
        "k:ns/b",
      }
    `);
    await expect(traversal.toEntityRefSet({ minDepth: 1 })).resolves
      .toMatchInlineSnapshot(`
      Set {
        "k:ns/b",
        "k:ns/c",
      }
    `);
    await expect(traversal.toEntityRefSet({ minDepth: 1, maxDepth: 1 }))
      .resolves.toMatchInlineSnapshot(`
      Set {
        "k:ns/b",
      }
    `);
    await expect(traversal.toEntityRefSet({ maxDepth: 2000000000000000 }))
      .resolves.toMatchInlineSnapshot(`
      Set {
        "k:ns/a",
        "k:ns/b",
        "k:ns/c",
      }
    `);

    await expect(
      traversal.toEntityArray().then(es => es.map(stringifyEntityRef)),
    ).resolves.toMatchInlineSnapshot(`
      [
        "k:ns/a",
        "k:ns/b",
      ]
    `);

    await expect(
      traversal
        .toEntitySet()
        .then(es => new Set([...es].map(stringifyEntityRef))),
    ).resolves.toMatchInlineSnapshot(`
      Set {
        "k:ns/a",
        "k:ns/b",
      }
    `);

    await expect(traversal.toGraph()).resolves.toMatchInlineSnapshot(`
      {
        "entities": {
          "k:ns/a": {
            "apiVersion": "v",
            "kind": "k",
            "metadata": {
              "name": "a",
              "namespace": "ns",
            },
            "relations": [
              {
                "targetRef": "k:ns/b",
                "type": "dependsOn",
              },
            ],
          },
          "k:ns/b": {
            "apiVersion": "v",
            "kind": "k",
            "metadata": {
              "name": "b",
              "namespace": "ns",
            },
            "relations": [
              {
                "targetRef": "k:ns/a",
                "type": "dependsOn",
              },
              {
                "targetRef": "k:ns/c",
                "type": "dependsOn",
              },
            ],
          },
        },
        "nodes": {
          "k:ns/a": {
            "entityRef": "k:ns/a",
            "relations": [
              {
                "targetRef": "k:ns/b",
                "type": "dependsOn",
              },
            ],
          },
          "k:ns/b": {
            "entityRef": "k:ns/b",
            "relations": [
              {
                "targetRef": "k:ns/a",
                "type": "dependsOn",
              },
              {
                "targetRef": "k:ns/c",
                "type": "dependsOn",
              },
            ],
          },
          "k:ns/c": {
            "entityRef": "k:ns/c",
            "relations": [],
          },
        },
        "roots": [
          "k:ns/a",
        ],
      }
    `);

    await expect(traversal.toGraph({ includeMissing: false })).resolves
      .toMatchInlineSnapshot(`
      {
        "entities": {
          "k:ns/a": {
            "apiVersion": "v",
            "kind": "k",
            "metadata": {
              "name": "a",
              "namespace": "ns",
            },
            "relations": [
              {
                "targetRef": "k:ns/b",
                "type": "dependsOn",
              },
            ],
          },
          "k:ns/b": {
            "apiVersion": "v",
            "kind": "k",
            "metadata": {
              "name": "b",
              "namespace": "ns",
            },
            "relations": [
              {
                "targetRef": "k:ns/a",
                "type": "dependsOn",
              },
              {
                "targetRef": "k:ns/c",
                "type": "dependsOn",
              },
            ],
          },
        },
        "nodes": {
          "k:ns/a": {
            "entityRef": "k:ns/a",
            "relations": [
              {
                "targetRef": "k:ns/b",
                "type": "dependsOn",
              },
            ],
          },
          "k:ns/b": {
            "entityRef": "k:ns/b",
            "relations": [
              {
                "targetRef": "k:ns/a",
                "type": "dependsOn",
              },
            ],
          },
        },
        "roots": [
          "k:ns/a",
        ],
      }
    `);
  });

  it('can start with a query', async () => {
    const catalogApi = new InMemoryCatalogClient({
      entities: [
        {
          apiVersion: 'v',
          kind: 'k',
          metadata: { name: 'a', namespace: 'ns' },
          relations: [{ type: 'dependsOn', targetRef: 'k:ns/b' }],
        },
        {
          apiVersion: 'v',
          kind: 'k',
          metadata: { name: 'b', namespace: 'ns' },
          relations: [
            { type: 'dependsOn', targetRef: 'k:ns/a' },
            { type: 'dependsOn', targetRef: 'k:ns/c' },
          ],
        },
      ],
    });
    const traversal = traverseCatalog({
      catalogApi,
      initial: { filter: { 'metadata.name': 'b' } },
      follow: {
        relation: 'dependsOn',
      },
    });

    await expect(traversal.toEntityRefArray()).resolves.toMatchInlineSnapshot(`
      [
        "k:ns/b",
        "k:ns/a",
        "k:ns/c",
      ]
    `);
  });

  it('can filter by source and target kind', async () => {
    const catalogApi = new InMemoryCatalogClient({
      entities: [
        {
          apiVersion: 'v',
          kind: 'ka',
          metadata: { name: 'a', namespace: 'ns' },
          relations: [{ type: 'dependsOn', targetRef: 'kb:ns/b' }],
        },
        {
          apiVersion: 'v',
          kind: 'kb',
          metadata: { name: 'b', namespace: 'ns' },
          relations: [{ type: 'dependsOn', targetRef: 'kc:ns/c' }],
        },
        {
          apiVersion: 'v',
          kind: 'kc',
          metadata: { name: 'b', namespace: 'ns' },
          relations: [],
        },
      ],
    });

    await expect(
      traverseCatalog({
        catalogApi,
        initial: { entityRef: 'ka:ns/a' },
        follow: {
          relation: 'dependsOn',
        },
      }).toEntityRefArray(),
    ).resolves.toMatchInlineSnapshot(`
      [
        "ka:ns/a",
        "kb:ns/b",
        "kc:ns/c",
      ]
    `);

    await expect(
      traverseCatalog({
        catalogApi,
        initial: { entityRef: 'ka:ns/a' },
        follow: {
          fromKind: 'ka',
          relation: 'dependsOn',
        },
      }).toEntityRefArray(),
    ).resolves.toMatchInlineSnapshot(`
      [
        "ka:ns/a",
        "kb:ns/b",
      ]
    `);

    await expect(
      traverseCatalog({
        catalogApi,
        initial: { entityRef: 'ka:ns/a' },
        follow: {
          relation: 'dependsOn',
          toKind: 'kb',
        },
      }).toEntityRefArray(),
    ).resolves.toMatchInlineSnapshot(`
      [
        "ka:ns/a",
        "kb:ns/b",
      ]
    `);

    await expect(
      traverseCatalog({
        catalogApi,
        initial: { entityRef: 'ka:ns/a' },
        follow: [
          {
            relation: 'dependsOn',
            toKind: 'kb',
          },
          {
            relation: 'dependsOn',
            fromKind: 'kb',
          },
        ],
      }).toEntityRefArray(),
    ).resolves.toMatchInlineSnapshot(`
      [
        "ka:ns/a",
        "kb:ns/b",
        "kc:ns/c",
      ]
    `);
  });
});
