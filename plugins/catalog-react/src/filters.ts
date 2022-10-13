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
  AlphaEntity,
  Entity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { EntityFilter, UserListFilterKind } from './types';

/**
 * Filter entities based on Kind.
 * @public
 */
export class EntityKindFilter implements EntityFilter {
  constructor(readonly value: string) {}

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
 */
export class EntityOwnerFilter implements EntityFilter {
  constructor(readonly values: string[]) {}

  getCatalogFilters() {
    return {
      'relations.ownedBy': this.values.map(value =>
        stringifyEntityRef(
          parseEntityRef(value, {
            defaultKind: 'group',
          }),
        ),
      ),
    };
  }

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

  getCatalogFilters() {
    return { 'spec.lifecycle': this.values };
  }

  toQueryValue(): string[] {
    return this.values;
  }
}

/**
 * Filters entities based on whatever the user has starred or owns them.
 * @public
 */
export class UserListFilter implements EntityFilter {
  private constructor(
    readonly value: UserListFilterKind,
    readonly refs?: string[],
  ) {}

  static owned(ownershipEntityRefs: string[]) {
    return new UserListFilter('owned', ownershipEntityRefs);
  }

  static all() {
    return new UserListFilter('all');
  }

  static starred(starredEntityRefs: string[]) {
    return new UserListFilter('starred', starredEntityRefs);
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
    return true;
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
