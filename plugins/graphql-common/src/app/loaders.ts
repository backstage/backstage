import type { EntityRef, Loader } from './types';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import DataLoader from 'dataloader';
import { EnvelopError } from '@envelop/core';
import type { CatalogClient } from '@backstage/catalog-client';

export function createLoader(catalog: Pick<CatalogClient,'getEntitiesByRefs'>): Loader {
  return new DataLoader<EntityRef, Entity>(async (refs): Promise<Array<Entity | Error>> => {
    const entityRefs: string[] = refs.map((ref) => typeof ref === 'string' ? ref : stringifyEntityRef(ref))
    const result = await catalog.getEntitiesByRefs({ entityRefs });
    return result.items.map((entity, index) => entity ?? new EnvelopError(`no such node with ref: '${refs[index]}'`));
  });
}
