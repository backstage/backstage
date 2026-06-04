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

import { Entity } from '@backstage/catalog-model';
import { CatalogContextRetriever } from './CatalogContextRetriever';

const e = (overrides: Partial<Entity> & { name: string }): Entity =>
  ({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: overrides.name, ...overrides.metadata },
    spec: overrides.spec ?? {},
  } as Entity);

const buildCatalog = (items: Entity[]) => ({
  getEntities: jest.fn().mockResolvedValue({ items }),
});

describe('CatalogContextRetriever', () => {
  it('returns the highest-scoring entities by name match', async () => {
    const catalog = buildCatalog([
      e({ name: 'payments-api' }),
      e({ name: 'auth-service' }),
      e({ name: 'unrelated-thing' }),
    ]);
    const retriever = new CatalogContextRetriever(catalog as any, 5);

    const result = await retriever.retrieve('who owns payments?');

    expect(result.map(r => r.entity.metadata.name)).toEqual(['payments-api']);
    expect(result[0].entityRef).toEqual('component:default/payments-api');
  });

  it('boosts exact token matches over substring matches', async () => {
    const catalog = buildCatalog([
      e({ name: 'auth-service' }),
      e({ name: 'authorization-helper' }),
    ]);
    const retriever = new CatalogContextRetriever(catalog as any, 5);

    const result = await retriever.retrieve('tell me about auth');

    // auth-service contains exact token "auth" via the - split; authorization
    // only contains it as a prefix substring.
    expect(result[0].entity.metadata.name).toEqual('auth-service');
  });

  it('matches against description and tags', async () => {
    const catalog = buildCatalog([
      e({
        name: 'svc-a',
        metadata: {
          name: 'svc-a',
          description: 'Handles billing and invoicing flows',
        },
      }),
      e({
        name: 'svc-b',
        metadata: { name: 'svc-b', tags: ['billing', 'finance'] },
      }),
      e({ name: 'unrelated' }),
    ]);
    const retriever = new CatalogContextRetriever(catalog as any, 5);

    const result = await retriever.retrieve('billing services');

    expect(result.map(r => r.entity.metadata.name)).toEqual(
      expect.arrayContaining(['svc-a', 'svc-b']),
    );
    expect(result.map(r => r.entity.metadata.name)).not.toContain('unrelated');
  });

  it('returns empty list when the question has no meaningful tokens', async () => {
    const catalog = buildCatalog([e({ name: 'thing' })]);
    const retriever = new CatalogContextRetriever(catalog as any, 5);

    const result = await retriever.retrieve('what is the?');

    expect(result).toEqual([]);
    // Should short-circuit before calling the catalog
    expect(catalog.getEntities).not.toHaveBeenCalled();
  });

  it('respects the limit', async () => {
    const catalog = buildCatalog(
      Array.from({ length: 10 }, (_, i) => e({ name: `payment-${i}` })),
    );
    const retriever = new CatalogContextRetriever(catalog as any, 3);

    const result = await retriever.retrieve('payment');

    expect(result).toHaveLength(3);
  });

  it('forwards the caller token to the catalog when provided', async () => {
    const catalog = buildCatalog([e({ name: 'foo' })]);
    const retriever = new CatalogContextRetriever(catalog as any, 5);

    await retriever.retrieve('foo', { credentials: { token: 't0k3n' } });

    expect(catalog.getEntities).toHaveBeenCalledWith({}, { token: 't0k3n' });
  });
});
