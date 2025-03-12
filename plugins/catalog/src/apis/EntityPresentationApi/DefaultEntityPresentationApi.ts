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
  Entity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { IconComponent } from '@backstage/core-plugin-api';
import {
  CatalogApi,
  EntityPresentationApi,
  EntityRefPresentation,
  EntityRefPresentationSnapshot,
} from '@backstage/plugin-catalog-react';
import { durationToMilliseconds, HumanDuration } from '@backstage/types';
import DataLoader from 'dataloader';
import ObservableImpl from 'zen-observable';
import {
  createDefaultRenderer,
  DEFAULT_BATCH_DELAY,
  DEFAULT_CACHE_TTL,
  DEFAULT_ICONS,
} from './defaults';

/**
 * A custom renderer for the {@link DefaultEntityPresentationApi}.
 *
 * @public
 */
export interface DefaultEntityPresentationApiRenderer {
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
    snapshot: Omit<EntityRefPresentationSnapshot, 'entityRef'>;
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
   * @defaultValue 10 seconds
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
   * A mapping from kinds to icons.
   *
   * @remarks
   *
   * The keys are kinds (case insensitive) that map to icon values to represent
   * kinds by. These are merged with the default set of icons.
   */
  kindIcons?: Record<string, IconComponent>;

  /**
   * A custom renderer, if any.
   */
  renderer?: DefaultEntityPresentationApiRenderer;
}

interface CacheEntry {
  updatedAt: number;
  entity: Entity | undefined;
}

// Simple expiry map for the data loader, which only expects a map that implements set, get, and delete and clear
export class ExpiryMap<K, V> extends Map<K, V> {
  #ttlMs: number;
  #timestamps: Map<K, number> = new Map();

  constructor(ttlMs: number) {
    super();
    this.#ttlMs = ttlMs;
  }

  set(key: K, value: V) {
    const result = super.set(key, value);
    this.#timestamps.set(key, Date.now());
    return result;
  }

  get(key: K) {
    if (!this.has(key)) {
      return undefined;
    }
    const timestamp = this.#timestamps.get(key)!;
    if (Date.now() - timestamp > this.#ttlMs) {
      this.delete(key);
      return undefined;
    }
    return super.get(key);
  }

  delete(key: K) {
    this.#timestamps.delete(key);
    return super.delete(key);
  }

  clear() {
    this.#timestamps.clear();
    return super.clear();
  }
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
  readonly #kindIcons: Record<string, IconComponent>; // lowercased kinds
  readonly #renderer: DefaultEntityPresentationApiRenderer;

  private constructor(options: DefaultEntityPresentationApiOptions) {
    const cacheTtl = options.cacheTtl ?? DEFAULT_CACHE_TTL;
    const batchDelay = options.batchDelay ?? DEFAULT_BATCH_DELAY;
    const renderer = options.renderer ?? createDefaultRenderer({ async: true });

    const kindIcons: Record<string, IconComponent> = {};
    Object.entries(DEFAULT_ICONS).forEach(([kind, icon]) => {
      kindIcons[kind.toLocaleLowerCase('en-US')] = icon;
    });
    Object.entries(options.kindIcons ?? {}).forEach(([kind, icon]) => {
      kindIcons[kind.toLocaleLowerCase('en-US')] = icon;
    });

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

    this.#cacheTtlMs = durationToMilliseconds(cacheTtl);
    this.#cache = new Map();
    this.#kindIcons = kindIcons;
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
    const { entityRef, kind, entity, needsLoad } =
      this.#getEntityForInitialRender(entityOrRef);

    // Make a wrapping helper for rendering
    const render = (options: {
      loading: boolean;
      entity?: Entity;
    }): EntityRefPresentationSnapshot => {
      const { snapshot } = this.#renderer.render({
        entityRef: entityRef,
        loading: options.loading,
        entity: options.entity,
        context: context || {},
      });
      return {
        ...snapshot,
        entityRef: entityRef,
        Icon: this.#maybeFallbackIcon(snapshot.Icon, kind),
      };
    };

    // First the initial render
    let initialSnapshot: EntityRefPresentationSnapshot;
    try {
      initialSnapshot = render({
        loading: needsLoad,
        entity: entity,
      });
    } catch {
      // This is what gets presented if the renderer throws an error
      initialSnapshot = {
        primaryTitle: entityRef,
        entityRef: entityRef,
      };
    }

    if (!needsLoad) {
      return {
        snapshot: initialSnapshot,
        promise: Promise.resolve(initialSnapshot),
      };
    }

    // Load the entity and render it
    const maybeUpdatedSnapshot = Promise.resolve()
      .then(() => {
        return this.#loader?.load(entityRef);
      })
      .then(newEntity => {
        // We re-render no matter if we get back a new entity or the old
        // one or nothing, because of the now false loading state - in
        // case the renderer outputs different data depending on that
        return render({
          loading: false,
          entity: newEntity ?? entity,
        });
      })
      .catch(() => {
        // Intentionally ignored - we do not propagate errors to the
        // caller here. The presentation API should be error free and
        // always return SOMETHING that makes sense to render, and we have
        // already ensured above that the initial snapshot was that.
        return undefined;
      });

    const observable = new ObservableImpl<EntityRefPresentationSnapshot>(
      subscriber => {
        let aborted = false;

        maybeUpdatedSnapshot
          .then(updatedSnapshot => {
            if (updatedSnapshot) {
              subscriber.next(updatedSnapshot);
            }
          })
          .finally(() => {
            if (!aborted) {
              subscriber.complete();
            }
          });

        return () => {
          aborted = true;
        };
      },
    );

    const promise = maybeUpdatedSnapshot.then(updatedSnapshot => {
      return updatedSnapshot ?? initialSnapshot;
    });

    return {
      snapshot: initialSnapshot,
      update$: observable,
      promise: promise,
    };
  }

  #getEntityForInitialRender(entityOrRef: Entity | string): {
    entity: Entity | undefined;
    kind: string;
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
        kind: entityOrRef.kind,
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
      kind: parseEntityRef(entityOrRef).kind,
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
    const cacheTtlMs = durationToMilliseconds(options.cacheTtl);
    const batchDelayMs = durationToMilliseconds(options.batchDelay);

    return new DataLoader(
      async (entityRefs: readonly string[]) => {
        const { items } = await options.catalogApi!.getEntitiesByRefs({
          entityRefs: entityRefs as string[],
          fields: [
            'kind',
            'metadata.name',
            'metadata.namespace',
            'metadata.title',
            'metadata.description',
            'spec.profile.displayName',
            'spec.type',
          ],
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
        name: 'DefaultEntityPresentationApi',
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

  #maybeFallbackIcon(
    renderedIcon: IconComponent | false | undefined,
    kind: string,
  ): IconComponent | false | undefined {
    if (renderedIcon) {
      return renderedIcon;
    } else if (renderedIcon === false) {
      return false;
    }

    return this.#kindIcons[kind.toLocaleLowerCase('en-US')];
  }
}
