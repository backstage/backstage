/*
 * Copyright 2020 Spotify AB
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
  EntityName,
  ENTITY_DEFAULT_NAMESPACE,
  serializeEntityName,
} from '@backstage/catalog-model';
import merge from 'lodash/merge';

type EntityStorageObject = {
  type: 'entity';
  entity: Entity;
};

type EntityFragmentSelector = {
  name?: EntityName;
  labels?: { [label: string]: string };
  annotations?: { [annotation: string]: string };
};

type EntityFragment = {
  // Fragments are identified using an ID, which have to be used for updates and deletions
  id: string;
  selector: EntityFragmentSelector;
  data: Partial<Entity>;
};

type FragmentStorageObject = {
  type: 'fragment';
  fragment: EntityFragment;
};

type StorageObject = FragmentStorageObject | EntityStorageObject;

// An experimental implementation of a smart storage core, where entities are finalized at read-time
export class StorageCore {
  private readonly entities = new Map<string, Entity>();
  private readonly fragments = new Map<string, EntityFragment>();

  store(object: StorageObject) {
    if (object.type === 'entity') {
      // This doesn't work for all names, but w/e
      const ref = serializeEntityName(name) as string;
      this.entities.set(ref, object.entity);
    } else if (object.type === 'fragment') {
      this.fragments.set(object.fragment.id, object.fragment);
    }
  }

  getEntity(name: EntityName): Entity | undefined {
    const ref = serializeEntityName(name) as string;
    const entity = this.entities.get(ref);
    if (!entity) {
      return undefined;
    }

    let clone = JSON.parse(JSON.stringify(entity));

    for (const fragment of this.lookupFragments(entity)) {
      // Order here is likely very important, would we store with a strict order?
      // We could also forbid any kind of overlap between the fragments, but that
      // might be a bit limiting.
      clone = merge(clone, fragment);
    }

    return clone;
  }

  private lookupFragments(entity: Entity): EntityFragment[] {
    return Array.from(this.fragments.values()).filter(({ selector }) => {
      let match = false;

      if (selector.name) {
        const kindMatch = entity.kind === selector.name.kind;
        const nameMatch = entity.metadata.name === selector.name.name;
        const namespaceMatch =
          (entity.metadata.namespace ?? ENTITY_DEFAULT_NAMESPACE) ===
          selector.name.namespace;
        if (kindMatch && nameMatch && namespaceMatch) {
          match = true;
        } else {
          return false;
        }
      }

      if (selector.labels) {
        const labelsMatch = Object.entries(selector.labels).every(
          ([key, value]) => entity.metadata.labels?.[key] === value,
        );
        if (labelsMatch) {
          match = true;
        } else {
          return false;
        }
      }

      if (selector.annotations) {
        const annotationsMatch = Object.entries(selector.annotations).every(
          ([key, value]) => entity.metadata.annotations?.[key] === value,
        );
        if (annotationsMatch) {
          match = true;
        } else {
          return false;
        }
      }

      return match;
    });
  }
}
