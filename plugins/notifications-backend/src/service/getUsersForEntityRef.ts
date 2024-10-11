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
import { CatalogApi } from '@backstage/catalog-client';

const isUserEntityRef = (ref: string) =>
  parseEntityRef(ref).kind.toLocaleLowerCase() === 'user';

// Partitions array of entity references to two arrays; user entity refs and other entity refs
const partitionEntityRefs = (refs: string[]): string[][] =>
  refs.reduce(
    ([userEntityRefs, otherEntityRefs]: string[][], ref: string) => {
      return isUserEntityRef(ref)
        ? [[...userEntityRefs, ref], otherEntityRefs]
        : [userEntityRefs, [...otherEntityRefs, ref]];
    },
    [[], []],
  );

export const getUsersForEntityRef = async (
  entityRef: string | string[] | null,
  excludeEntityRefs: string | string[],
  options: {
    auth: AuthService;
    catalogClient: CatalogApi;
  },
): Promise<string[]> => {
  const { auth, catalogClient } = options;

  if (entityRef === null) {
    return [];
  }

  const { token } = await auth.getPluginRequestToken({
    onBehalfOf: await auth.getOwnServiceCredentials(),
    targetPluginId: 'catalog',
  });

  const excluded = Array.isArray(excludeEntityRefs)
    ? excludeEntityRefs
    : [excludeEntityRefs];

  const refsArr = Array.isArray(entityRef) ? entityRef : [entityRef];
  const [userEntityRefs, otherEntityRefs] = partitionEntityRefs(refsArr);
  const users: string[] = userEntityRefs.filter(ref => !excluded.includes(ref));
  const entityRefs = otherEntityRefs.filter(ref => !excluded.includes(ref));

  const fields = ['kind', 'metadata.name', 'metadata.namespace', 'relations'];
  let entities: Array<Entity | undefined> = [];
  if (entityRefs.length > 0) {
    const fetchedEntities = await catalogClient.getEntitiesByRefs(
      {
        entityRefs,
        fields,
      },
      { token },
    );
    entities = fetchedEntities.items;
  }

  const mapEntity = async (entity: Entity | undefined): Promise<string[]> => {
    if (!entity) {
      return [];
    }

    const currentEntityRef = stringifyEntityRef(entity);
    if (excluded.includes(currentEntityRef)) {
      return [];
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
        const childGroups = await catalogClient.getEntitiesByRefs(
          {
            entityRefs: childGroupRefs,
            fields,
          },
          { token },
        );
        childGroupUsers = await Promise.all(childGroups.items.map(mapEntity));
      }

      return [...groupUsers, ...childGroupUsers.flat(2)].filter(
        ref => !excluded.includes(ref),
      );
    }

    if (entity.relations?.length) {
      const ownerRef = entity.relations.find(
        relation => relation.type === RELATION_OWNED_BY,
      )?.targetRef;

      if (!ownerRef) {
        return [];
      }

      if (isUserEntityRef(ownerRef)) {
        if (excluded.includes(ownerRef)) {
          return [];
        }
        return [ownerRef];
      }

      const owner = await catalogClient.getEntityByRef(ownerRef, { token });
      return mapEntity(owner);
    }

    return [];
  };

  for (const entity of entities) {
    const u = await mapEntity(entity);
    users.push(...u);
  }

  return [...new Set(users)].filter(Boolean);
};
