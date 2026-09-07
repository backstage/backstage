/*
 * Copyright 2024 The Backstage Authors
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
  isGroupEntity,
  isUserEntity,
  parseEntityRef,
  RELATION_HAS_MEMBER,
  RELATION_OWNED_BY,
  RELATION_PARENT_OF,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { AuthService } from '@backstage/backend-plugin-api';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { NotificationRecipientResolver } from '@backstage/plugin-notifications-node';

const isUserEntityRef = (ref: string) =>
  parseEntityRef(ref).kind.toLocaleLowerCase() === 'user';

// Partitions array of entity references to two arrays; user entity refs and other entity refs
const partitionEntityRefs = (refs: string[]): string[][] => {
  const ret = [[], []] as string[][];
  for (const ref of refs) {
    if (isUserEntityRef(ref)) {
      ret[0].push(ref);
    } else {
      ret[1].push(ref);
    }
  }
  return ret;
};

export class DefaultNotificationRecipientResolver
  implements NotificationRecipientResolver
{
  private readonly auth: AuthService;
  private readonly catalog: CatalogService;

  constructor(auth: AuthService, catalog: CatalogService) {
    this.auth = auth;
    this.catalog = catalog;
  }

  async resolveNotificationRecipients(options: {
    entityRefs: string[];
    excludedEntityRefs?: string[];
  }): Promise<{ userEntityRefs: string[] }> {
    const { entityRefs, excludedEntityRefs = [] } = options;

    const users = new Set<string>();
    const seen = new Set<string>();

    const todo = [...new Set(entityRefs)];
    todo.forEach(ref => seen.add(ref));

    const fields = ['kind', 'metadata.name', 'metadata.namespace', 'relations'];

    while (todo.length) {
      const [userEntityRefs, otherEntityRefs] = partitionEntityRefs(todo);
      todo.length = 0;

      userEntityRefs.forEach(user => users.add(user));

      // Filter excluded refs to avoid unnecessary catalog lookups
      const filtered = otherEntityRefs.filter(
        ref => !excludedEntityRefs.includes(ref),
      );
      let entities: Array<Entity> = [];
      if (filtered.length > 0) {
        const fetchedEntities = await this.catalog.getEntitiesByRefs(
          {
            entityRefs: filtered,
            fields,
          },
          { credentials: await this.auth.getOwnServiceCredentials() },
        );
        entities = fetchedEntities.items.filter(
          (entity): entity is Entity => entity !== undefined,
        );
      }

      entities.forEach(entity => {
        const currentEntityRef = stringifyEntityRef(entity);
        if (excludedEntityRefs.includes(currentEntityRef)) {
          return;
        }

        if (isUserEntity(entity)) {
          users.add(currentEntityRef);
          return;
        }

        if (isGroupEntity(entity)) {
          for (const relation of entity.relations ?? []) {
            if (
              relation.type === RELATION_HAS_MEMBER &&
              isUserEntityRef(relation.targetRef)
            ) {
              users.add(relation.targetRef);
            } else if (
              relation.type === RELATION_PARENT_OF &&
              !seen.has(relation.targetRef)
            ) {
              seen.add(relation.targetRef);
              todo.push(relation.targetRef);
            }
          }
          return;
        }

        // Any other kind (component, template, ...): route to its owner and
        // let the next pass classify and expand it.
        const ownerRef = entity.relations?.find(
          relation => relation.type === RELATION_OWNED_BY,
        )?.targetRef;

        if (ownerRef && !seen.has(ownerRef)) {
          seen.add(ownerRef);
          todo.push(ownerRef);
        }
      });
    }
    return {
      userEntityRefs: [...new Set(users)]
        .filter(Boolean)
        // Need to filter again after resolving users
        .filter(ref => !excludedEntityRefs.includes(ref)),
    };
  }
}
