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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import {
  CatalogApi,
  EntityPresentationApi,
  EntityRefPresentation,
  EntityRefPresentationSnapshot,
} from '@backstage/plugin-catalog-react';
import { HumanDuration } from '@backstage/types';
import DataLoader from 'dataloader';
import ExpiryMap from 'expiry-map';
import uniq from 'lodash/uniq';
import ObservableImpl from 'zen-observable';
import {
  DEFAULT_BATCH_DELAY,
  DEFAULT_CACHE_TTL,
  DEFAULT_ENTITY_FIELDS,
  createDefaultRenderer,
} from './defaults';
import { durationToMs } from './util';

/**
 * A custom renderer for the {@link DefaultEntityPresentationApi}.
 *
 * @public
 */
export interface DefaultEntityPresentationApiRenderer {
  /**
   * An extra set of fields to request for entities from the catalog API.
   *
   * @remarks
   *
   * You may want to specify this to get additional entity fields. The smaller
   * the set of fields, the more efficient requests will be to the catalog
   * backend.
   *
   * The default set of fields is: apiVersion, kind, the scalar metadata fields
   * (uid, etag, name, namespace, title, description), spec.type, and
   * spec.profile.
   *
   * This field is ignored if async is set to false.
   */
  extraFields?: string[];

  /**
   * Whether to request the entity from the catalog API asynchronously.
   *
   * @remarks
   *
   * If this is set to true, entity data will be streamed in from the catalog
   * whenever needed, and the render function may be called more than once:
   * first when no entity data existed (or with old cached data), and then again
   * at a later point when data is loaded from the catalog that proved to be
   * different from the old one.
   *
   * @defaultValue true
   */
  async?: boolean;

  /**
   * The actual render function.
   *
   * @remarks
   *
   * This function may be called multiple times.
   *
   * The loading flag signals that the framework MAY be trying to load more
   * entity data from the catalog and call the render function again, if it
   * succeeds. In some cases you may want to render a loading state in that
   * case.
   *
   * The entity may or may not be given. If the caller of the presentation API
   * did present an entity upfront, then that's what will be passed in here.
   * Otherwise, it may be a server-side entity that either comes from a local
   * cache or directly from the server.
   *
   * In either case, the renderer should return a presentation that is the most
   * useful possible for the end user, given the data that is available.
   */
  render: (options: {
    entityRef: string;
    loading: boolean;
    entity: Entity | undefined;
    context: {
      defaultKind?: string;
      defaultNamespace?: string;
    };
  }) => {
    snapshot: Omit<EntityRefPresentationSnapshot, 'entityRef' | 'entity'>;
  };
}

/**
 * Options for the {@link DefaultEntityPresentationApi}.
 *
 * @public
 */
export interface DefaultEntityPresentationApiOptions {
  /**
   * The catalog API to use. If you want to use any asynchronous features, you
   * must supply one.
   */
  catalogApi?: CatalogApi;

  /**
   * When to expire entities that have been loaded from the catalog API and
   * cached for a while.
   *
   * @defaultValue 30 seconds
   * @remarks
   *
   * The higher this value, the lower the load on the catalog API, but also the
   * higher the risk of users seeing stale data.
   */
  cacheTtl?: HumanDuration;

  /**
   * For how long to wait before sending a batch of entity references to the
   * catalog API.
   *
   * @defaultValue 50 milliseconds
   * @remarks
   *
   * The higher this value, the greater the chance of batching up requests from
   * across a page, but also the longer the lag time before displaying accurate
   * information.
   */
  batchDelay?: HumanDuration;

  /**
   * A custom renderer, if any.
   */
  renderer?: DefaultEntityPresentationApiRenderer;
}

interface CacheEntry {
  updatedAt: number;
  entity: Entity | undefined;
}

/**
 * Default implementation of the {@link @backstage/plugin-catalog-react#EntityPresentationApi}.
 *
 * @public
 */
export class DefaultEntityPresentationApi implements EntityPresentationApi {
  /**
   * Creates a new presentation API that does not reach out to the catalog.
   */
  static createLocal(): EntityPresentationApi {
    return new DefaultEntityPresentationApi({
      renderer: createDefaultRenderer({ async: false }),
    });
  }

  /**
   * Creates a new presentation API that calls out to the catalog as needed to
   * get additional information about entities.
   */
  static create(
    options: DefaultEntityPresentationApiOptions,
  ): EntityPresentationApi {
    return new DefaultEntityPresentationApi(options);
  }

  // This cache holds on to all entity data ever loaded, no matter how old. Each
  // entry is tagged with a timestamp of when it was inserted. We use this map
  // to be able to always render SOME data even though the information is old.
  // Entities change very rarely, so it's likely that the rendered information
  // was perfectly fine in the first place.
  readonly #cache: Map<string, CacheEntry>;
  readonly #cacheTtlMs: number;
  readonly #loader: DataLoader<string, Entity | undefined> | undefined;
  readonly #renderer: DefaultEntityPresentationApiRenderer;

  private constructor(options: DefaultEntityPresentationApiOptions) {
    const cacheTtl = options.cacheTtl ?? DEFAULT_CACHE_TTL;
    const batchDelay = options.batchDelay ?? DEFAULT_BATCH_DELAY;
    const renderer = options.renderer ?? createDefaultRenderer({ async: true });

    if (renderer.async) {
      if (!options.catalogApi) {
        throw new TypeError(`Asynchronous rendering requires a catalog API`);
      }
      this.#loader = this.#createLoader({
        cacheTtl,
        batchDelay,
        renderer,
        catalogApi: options.catalogApi,
      });
    }

    this.#cacheTtlMs = durationToMs(cacheTtl);
    this.#cache = new Map();
    this.#renderer = renderer;
  }

  /** {@inheritdoc @backstage/plugin-catalog-react#EntityPresentationApi.forEntity} */
  forEntity(
    entityOrRef: Entity | string,
    context?: {
      defaultKind?: string;
      defaultNamespace?: string;
    },
  ): EntityRefPresentation {
    const { entityRef, entity, needsLoad } =
      this.#getEntityForInitialRender(entityOrRef);

    let rendered: Omit<EntityRefPresentationSnapshot, 'entityRef' | 'entity'>;
    try {
      const output = this.#renderer.render({
        entityRef: entityRef,
        loading: needsLoad,
        entity: entity,
        context: context || {},
      });
      rendered = output.snapshot;
    } catch {
      // This is what gets presented if the renderer throws an error
      rendered = {
        primaryTitle: entityRef,
      };
    }

    const observable = !needsLoad
      ? undefined
      : new ObservableImpl<EntityRefPresentationSnapshot>(subscriber => {
          let aborted = false;

          Promise.resolve()
            .then(() => this.#loader?.load(entityRef))
            .then(newEntity => {
              if (
                !aborted &&
                newEntity &&
                newEntity.metadata.etag !== entity?.metadata.etag
              ) {
                const output = this.#renderer.render({
                  entityRef: entityRef,
                  loading: false,
                  entity: newEntity,
                  context: context || {},
                });
                subscriber.next({
                  ...output.snapshot,
                  entityRef: entityRef,
                  entity: newEntity,
                });
              }
            })
            .catch(() => {
              // Intentionally ignored - we do not propagate errors to the
              // observable here. The presentation API should be error free and
              // always return SOMETHING that makes sense to render, and we have
              // already ensured above that the initial snapshot was that.
            })
            .finally(() => {
              if (!aborted) {
                subscriber.complete();
              }
            });

          return () => {
            aborted = true;
          };
        });

    return {
      snapshot: {
        ...rendered,
        entityRef: entityRef,
        entity: entity,
      },
      update$: observable,
    };
  }

  #getEntityForInitialRender(entityOrRef: Entity | string): {
    entity: Entity | undefined;
    entityRef: string;
    needsLoad: boolean;
  } {
    // If we were given an entity in the first place, we use it for a single
    // pass of rendering and assume that it's up to date and not partial (i.e.
    // we expect that it wasn't fetched in such a way that the required fields
    // of the renderer were excluded)
    if (typeof entityOrRef !== 'string') {
      return {
        entity: entityOrRef,
        entityRef: stringifyEntityRef(entityOrRef),
        needsLoad: false,
      };
    }

    const cached = this.#cache.get(entityOrRef);
    const cachedEntity: Entity | undefined = cached?.entity;
    const cacheNeedsUpdate =
      !cached || Date.now() - cached.updatedAt > this.#cacheTtlMs;
    const needsLoad =
      cacheNeedsUpdate &&
      this.#renderer.async !== false &&
      this.#loader !== undefined;

    return {
      entity: cachedEntity,
      entityRef: entityOrRef,
      needsLoad,
    };
  }

  #createLoader(options: {
    catalogApi: CatalogApi;
    cacheTtl: HumanDuration;
    batchDelay: HumanDuration;
    renderer: DefaultEntityPresentationApiRenderer;
  }): DataLoader<string, Entity | undefined> {
    const cacheTtlMs = durationToMs(options.cacheTtl);
    const batchDelayMs = durationToMs(options.batchDelay);

    const entityFields = uniq(
      [DEFAULT_ENTITY_FIELDS, options.renderer?.extraFields ?? []].flat(),
    );

    return new DataLoader(
      async (entityRefs: readonly string[]) => {
        const { items } = await options.catalogApi!.getEntitiesByRefs({
          entityRefs: entityRefs as string[],
          fields: [...entityFields],
        });

        const now = Date.now();
        entityRefs.forEach((entityRef, index) => {
          this.#cache.set(entityRef, {
            updatedAt: now,
            entity: items[index],
          });
        });

        return items;
      },
      {
        name: DefaultEntityPresentationApi.name,
        // This cache is the one that the data loader uses internally for
        // memoizing requests; essentially what it achieves is that multiple
        // requests for the same entity ref will be batched up into a single
        // request and then the resulting promises are held on to. We put an
        // expiring map here, which makes it so that it re-fetches data with the
        // expiry cadence of that map. Otherwise it would only fetch a given ref
        // once and then never try again. This cache does therefore not fulfill
        // the same purpose as the one that is in the root of the class.
        cacheMap: new ExpiryMap(cacheTtlMs),
        maxBatchSize: 100,
        batchScheduleFn: batchDelayMs
          ? cb => setTimeout(cb, batchDelayMs)
          : undefined,
      },
    );
  }
}
