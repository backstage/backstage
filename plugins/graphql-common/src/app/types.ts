import type { Entity } from '@backstage/catalog-model';
import { envelop } from '@envelop/core';
import DataLoader from 'dataloader';

export type EntityRef = string | { kind: string; namespace?: string; name: string }

export type Loader = DataLoader<EntityRef, Entity>;

export interface ResolverContext<TLoader extends DataLoader<any, any> = Loader> {
  loader: TLoader
  refToId: (ref: EntityRef) => string
}

export type EnvelopPlugins = Parameters<typeof envelop>[0]['plugins']
