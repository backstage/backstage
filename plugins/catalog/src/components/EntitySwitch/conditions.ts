/*
 * Copyright 2020 The Backstage Authors
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
  ApiEntity,
  ComponentEntity,
  DomainEntity,
  Entity,
  GroupEntity,
  LocationEntity,
  ResourceEntity,
  SystemEntity,
  UserEntity,
} from '@backstage/catalog-model';

function strCmp(a: string | undefined, b: string | undefined): boolean {
  return Boolean(
    a && a?.toLocaleLowerCase('en-US') === b?.toLocaleLowerCase('en-US'),
  );
}

function strCmpAll(value: string | undefined, cmpValues: string | string[]) {
  return typeof cmpValues === 'string'
    ? strCmp(value, cmpValues)
    : cmpValues.some(cmpVal => strCmp(value, cmpVal));
}

/**
 * For use in EntitySwitch.Case. Matches if the entity is of a given kind.
 * @public
 */
export function isKind(kinds: string | string[]) {
  return (entity: Entity) => strCmpAll(entity.kind, kinds);
}

/**
 * For use in EntitySwitch.Case. Matches if the entity is a Component of a given spec.type.
 * @public
 */
export function isComponentType(types: string | string[]) {
  return (entity: Entity) => {
    if (!strCmp(entity.kind, 'component')) {
      return false;
    }
    const componentEntity = entity as ComponentEntity;
    return strCmpAll(componentEntity.spec.type, types);
  };
}

/**
 * For use in EntitySwitch.Case. Matches if the entity is in a given namespace.
 * @public
 */
export function isNamespace(namespaces: string | string[]) {
  return (entity: Entity) => strCmpAll(entity.metadata?.namespace, namespaces);
}

/**
 * @public
 */
export function isApiEntity(entity: Entity): entity is ApiEntity {
  return entity.kind.toLocaleUpperCase('en-US') === 'API';
}
/**
 * @public
 */
export function isComponentEntity(entity: Entity): entity is ComponentEntity {
  return entity.kind.toLocaleUpperCase('en-US') === 'COMPONENT';
}
/**
 * @public
 */
export function isDomainEntity(entity: Entity): entity is DomainEntity {
  return entity.kind.toLocaleUpperCase('en-US') === 'DOMAIN';
}
/**
 * @public
 */
export function isGroupEntity(entity: Entity): entity is GroupEntity {
  return entity.kind.toLocaleUpperCase('en-US') === 'GROUP';
}
/**
 * @public
 */
export function isLocationEntity(entity: Entity): entity is LocationEntity {
  return entity.kind.toLocaleUpperCase('en-US') === 'LOCATION';
}
/**
 * @public
 */
export function isResourceEntity(entity: Entity): entity is ResourceEntity {
  return entity.kind.toLocaleUpperCase('en-US') === 'RESOURCE';
}
/**
 * @public
 */
export function isSystemEntity(entity: Entity): entity is SystemEntity {
  return entity.kind.toLocaleUpperCase('en-US') === 'SYSTEM';
}
/**
 * @public
 */
export function isUserEntity(entity: Entity): entity is UserEntity {
  return entity.kind.toLocaleUpperCase('en-US') === 'USER';
}
