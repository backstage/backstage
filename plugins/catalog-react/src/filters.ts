/*
 * Copyright 2021 The Backstage Authors
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
  RELATION_OWNED_BY,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { AlphaEntity } from '@backstage/catalog-model/alpha';
import { EntityFilter, UserListFilterKind } from './types';
import { getEntityRelations } from './utils/getEntityRelations';

/**
 * Filter entities based on Kind.
 * @public
 */
export class EntityKindFilter implements EntityFilter {
  constructor(readonly value: string, readonly label: string) {}

  getCatalogFilters(): Record<string, string | string[]> {
    return { kind: this.value };
  }

  toQueryValue(): string {
    return this.value;
  }
}

/**
 * Filters entities based on type
 * @public
 */
export class EntityTypeFilter implements EntityFilter {
  constructor(readonly value: string | string[]) {}

  // Simplify `string | string[]` for consumers, always returns an array
  getTypes(): string[] {
    return Array.isArray(this.value) ? this.value : [this.value];
  }

  getCatalogFilters(): Record<string, string | string[]> {
    return { 'spec.type': this.getTypes() };
  }

  toQueryValue(): string[] {
    return this.getTypes();
  }
}

/**
 * Filters entities based on tag.
 * @public
 */
export class EntityTagFilter implements EntityFilter {
  constructor(readonly values: string[]) {}

  filterEntity(entity: Entity): boolean {
    return this.values.every(v => (entity.metadata.tags ?? []).includes(v));
  }

  getCatalogFilters(): Record<string, string | string[]> {
    return { 'metadata.tags': this.values };
  }

  toQueryValue(): string[] {
    return this.values;
  }
}

/**
 * Filters entities where the text matches spec, title or tags.
 * @public
 */
export class EntityTextFilter implements EntityFilter {
  constructor(readonly value: string) {}

  filterEntity(entity: Entity): boolean {
    const words = this.toUpperArray(this.value.split(/\s/));
    const exactMatch = this.toUpperArray([entity.metadata.tags]);
    const partialMatch = this.toUpperArray([
      entity.metadata.name,
      entity.metadata.title,
      (entity.spec?.profile as { displayName?: string })?.displayName,
    ]);

    for (const word of words) {
      if (
        exactMatch.every(m => m !== word) &&
        partialMatch.every(m => !m.includes(word))
      ) {
        return false;
      }
    }

    return true;
  }

  getFullTextFilters() {
    return {
      term: this.value,
      // Update this to be more dynamic based on table columns.
      fields: ['metadata.name', 'metadata.title', 'spec.profile.displayName'],
    };
  }

  toQueryValue() {
    return this.value;
  }

  private toUpperArray(
    value: Array<string | string[] | undefined>,
  ): Array<string> {
    return value
      .flat()
      .filter((m): m is string => Boolean(m))
      .map(m => m.toLocaleUpperCase('en-US'));
  }
}

/**
 * Filter matching entities that are owned by group.
 * @public
 *
 * CAUTION: This class may contain both full and partial entity refs.
 */
export class EntityOwnerFilter implements EntityFilter {
  readonly values: string[];
  constructor(values: string[]) {
    this.values = values.reduce((fullRefs, ref) => {
      // Attempt to remove bad entity references here.
      try {
        fullRefs.push(
          stringifyEntityRef(parseEntityRef(ref, { defaultKind: 'Group' })),
        );
        return fullRefs;
      } catch (err) {
        return fullRefs;
      }
    }, [] as string[]);
  }

  getCatalogFilters(): Record<string, string | string[]> {
    return { 'relations.ownedBy': this.values };
  }

  filterEntity(entity: Entity): boolean {
    return this.values.some(v =>
      getEntityRelations(entity, RELATION_OWNED_BY).some(
        o => stringifyEntityRef(o) === v,
      ),
    );
  }

  /**
   * Get the URL query parameter value. May be a mix of full and humanized entity refs.
   * @returns list of entity refs.
   */
  toQueryValue(): string[] {
    return this.values;
  }
}

/**
 * Filters entities on lifecycle.
 * @public
 */
export class EntityLifecycleFilter implements EntityFilter {
  constructor(readonly values: string[]) {}

  getCatalogFilters(): Record<string, string | string[]> {
    return { 'spec.lifecycle': this.values };
  }

  filterEntity(entity: Entity): boolean {
    return this.values.some(v => entity.spec?.lifecycle === v);
  }

  toQueryValue(): string[] {
    return this.values;
  }
}

/**
 * Filters entities to those within the given namespace(s).
 * @public
 */
export class EntityNamespaceFilter implements EntityFilter {
  constructor(readonly values: string[]) {}

  getCatalogFilters(): Record<string, string | string[]> {
    return { 'metadata.namespace': this.values };
  }
  filterEntity(entity: Entity): boolean {
    return this.values.some(v => entity.metadata.namespace === v);
  }

  toQueryValue(): string[] {
    return this.values;
  }
}

/**
 * @public
 */
export class EntityUserFilter implements EntityFilter {
  private constructor(
    readonly value: UserListFilterKind,
    readonly refs?: string[],
  ) {}

  static owned(ownershipEntityRefs: string[]) {
    return new EntityUserFilter('owned', ownershipEntityRefs);
  }

  static all() {
    return new EntityUserFilter('all');
  }

  static starred(starredEntityRefs: string[]) {
    return new EntityUserFilter('starred', starredEntityRefs);
  }

  getCatalogFilters(): Record<string, string[]> {
    if (this.value === 'owned') {
      return { 'relations.ownedBy': this.refs ?? [] };
    }
    if (this.value === 'starred') {
      return {
        'metadata.name': this.refs?.map(e => parseEntityRef(e).name) ?? [],
      };
    }
    return {};
  }

  filterEntity(entity: Entity) {
    if (this.value === 'starred') {
      return this.refs?.includes(stringifyEntityRef(entity)) ?? true;
    }
    // used only for retro-compatibility with non paginated data.
    // This is supposed to return always true for paginated
    // owned entities, since the filters are applied server side.
    if (this.value === 'owned') {
      const relations = getEntityRelations(entity, RELATION_OWNED_BY);

      return (
        this.refs?.some(v =>
          relations.some(o => stringifyEntityRef(o) === v),
        ) ?? false
      );
    }
    return true;
  }

  toQueryValue(): string {
    return this.value;
  }
}

/**
 * Filters entities based on whatever the user has starred or owns them.
 * @deprecated use EntityUserFilter
 * @public
 */
export class UserListFilter implements EntityFilter {
  constructor(
    readonly value: UserListFilterKind,
    readonly isOwnedEntity: (entity: Entity) => boolean,
    readonly isStarredEntity: (entity: Entity) => boolean,
  ) {}

  filterEntity(entity: Entity): boolean {
    switch (this.value) {
      case 'owned':
        return this.isOwnedEntity(entity);
      case 'starred':
        return this.isStarredEntity(entity);
      default:
        return true;
    }
  }

  toQueryValue(): string {
    return this.value;
  }
}

/**
 * Filters entities based if it is an orphan or not.
 * @public
 */
export class EntityOrphanFilter implements EntityFilter {
  constructor(readonly value: boolean) {}

  getCatalogFilters(): Record<string, string | string[]> {
    if (this.value) {
      return { 'metadata.annotations.backstage.io/orphan': String(this.value) };
    }
    return {};
  }

  filterEntity(entity: Entity): boolean {
    const orphan = entity.metadata.annotations?.['backstage.io/orphan'];
    return orphan !== undefined && this.value.toString() === orphan;
  }
}

/**
 * Filters entities based on if it has errors or not.
 * @public
 */
export class EntityErrorFilter implements EntityFilter {
  constructor(readonly value: boolean) {}

  filterEntity(entity: Entity): boolean {
    const error =
      ((entity as AlphaEntity)?.status?.items?.length as number) > 0;
    return error !== undefined && this.value === error;
  }
}
