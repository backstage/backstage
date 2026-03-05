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

    const [userEntityRefs, otherEntityRefs] = partitionEntityRefs(entityRefs);
    const users: string[] = userEntityRefs.filter(
      ref => !excludedEntityRefs.includes(ref),
    );
    const filtered = otherEntityRefs.filter(
      ref => !excludedEntityRefs.includes(ref),
    );

    const fields = ['kind', 'metadata.name', 'metadata.namespace', 'relations'];
    let entities: Array<Entity | undefined> = [];
    if (filtered.length > 0) {
      const fetchedEntities = await this.catalog.getEntitiesByRefs(
        {
          entityRefs: filtered,
          fields,
        },
        { credentials: await this.auth.getOwnServiceCredentials() },
      );
      entities = fetchedEntities.items;
    }

    const cachedEntityRefs = new Map<string, string[]>();

    const mapEntity = async (entity: Entity | undefined): Promise<string[]> => {
      if (!entity) {
        return [];
      }

      const currentEntityRef = stringifyEntityRef(entity);
      if (excludedEntityRefs.includes(currentEntityRef)) {
        return [];
      }

      if (cachedEntityRefs.has(currentEntityRef)) {
        return cachedEntityRefs.get(currentEntityRef)!;
      }

      if (isUserEntity(entity)) {
        return [currentEntityRef];
      }

      if (isGroupEntity(entity)) {
        if (!entity.relations?.length) {
          return [];
        }

        const groupUsers = entity.relations
          .filter(
            relation =>
              relation.type === RELATION_HAS_MEMBER &&
              isUserEntityRef(relation.targetRef),
          )
          .map(r => r.targetRef);

        const childGroupRefs = entity.relations
          .filter(relation => relation.type === RELATION_PARENT_OF)
          .map(r => r.targetRef);

        let childGroupUsers: string[][] = [];
        if (childGroupRefs.length > 0) {
          const childGroups = await this.catalog.getEntitiesByRefs(
            {
              entityRefs: childGroupRefs,
              fields,
            },
            { credentials: await this.auth.getOwnServiceCredentials() },
          );
          childGroupUsers = await Promise.all(childGroups.items.map(mapEntity));
        }

        const ret = [
          ...new Set([...groupUsers, ...childGroupUsers.flat(2)]),
        ].filter(ref => !excludedEntityRefs.includes(ref));
        cachedEntityRefs.set(currentEntityRef, ret);
        return ret;
      }

      if (entity.relations?.length) {
        const ownerRef = entity.relations.find(
          relation => relation.type === RELATION_OWNED_BY,
        )?.targetRef;

        if (!ownerRef) {
          return [];
        }

        if (isUserEntityRef(ownerRef)) {
          if (excludedEntityRefs.includes(ownerRef)) {
            return [];
          }
          return [ownerRef];
        }

        const owner = await this.catalog.getEntityByRef(ownerRef, {
          credentials: await this.auth.getOwnServiceCredentials(),
        });
        const ret = await mapEntity(owner);
        cachedEntityRefs.set(currentEntityRef, ret);
        return ret;
      }

      return [];
    };

    for (const entity of entities) {
      const u = await mapEntity(entity);
      users.push(...u);
    }

    return {
      userEntityRefs: [...new Set(users)]
        .filter(Boolean)
        // Need to filter again after resolving users
        .filter(ref => !excludedEntityRefs.includes(ref)),
    };
  }
}
