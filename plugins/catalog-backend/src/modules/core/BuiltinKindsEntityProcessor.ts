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
  apiEntityV1alpha1Validator,
  ComponentEntity,
  componentEntityV1alpha1Validator,
  DomainEntity,
  domainEntityV1alpha1Validator,
  Entity,
  getCompoundEntityRef,
  GroupEntity,
  groupEntityV1alpha1Validator,
  locationEntityV1alpha1Validator,
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CHILD_OF,
  RELATION_CONSUMES_API,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_MEMBER,
  RELATION_HAS_PART,
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PARENT_OF,
  RELATION_PART_OF,
  RELATION_PROVIDES_API,
  ResourceEntity,
  resourceEntityV1alpha1Validator,
  SystemEntity,
  systemEntityV1alpha1Validator,
  UserEntity,
  userEntityV1alpha1Validator,
} from '@backstage/catalog-model';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
} from '@backstage/plugin-catalog-node';
import { doEmit } from '../util/doEmit';

/** @public */
export class BuiltinKindsEntityProcessor implements CatalogProcessor {
  private readonly validators = [
    apiEntityV1alpha1Validator,
    componentEntityV1alpha1Validator,
    resourceEntityV1alpha1Validator,
    groupEntityV1alpha1Validator,
    locationEntityV1alpha1Validator,
    userEntityV1alpha1Validator,
    systemEntityV1alpha1Validator,
    domainEntityV1alpha1Validator,
  ];

  getProcessorName(): string {
    return 'BuiltinKindsEntityProcessor';
  }

  async validateEntityKind(entity: Entity): Promise<boolean> {
    for (const validator of this.validators) {
      const results = await validator.check(entity);
      if (results) {
        return true;
      }
    }

    return false;
  }

  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    const selfRef = getCompoundEntityRef(entity);

    /*
     * Emit relations for the Component kind
     */

    if (entity.kind === 'Component') {
      const component = entity as ComponentEntity;
      doEmit(
        emit,
        selfRef,
        component.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
      doEmit(
        emit,
        selfRef,
        component.spec.subcomponentOf,
        { defaultKind: 'Component', defaultNamespace: selfRef.namespace },
        RELATION_PART_OF,
        RELATION_HAS_PART,
      );
      doEmit(
        emit,
        selfRef,
        component.spec.providesApis,
        { defaultKind: 'API', defaultNamespace: selfRef.namespace },
        RELATION_PROVIDES_API,
        RELATION_API_PROVIDED_BY,
      );
      doEmit(
        emit,
        selfRef,
        component.spec.consumesApis,
        { defaultKind: 'API', defaultNamespace: selfRef.namespace },
        RELATION_CONSUMES_API,
        RELATION_API_CONSUMED_BY,
      );
      doEmit(
        emit,
        selfRef,
        component.spec.dependsOn,
        { defaultNamespace: selfRef.namespace },
        RELATION_DEPENDS_ON,
        RELATION_DEPENDENCY_OF,
      );
      doEmit(
        emit,
        selfRef,
        component.spec.system,
        { defaultKind: 'System', defaultNamespace: selfRef.namespace },
        RELATION_PART_OF,
        RELATION_HAS_PART,
      );
    }

    /*
     * Emit relations for the API kind
     */

    if (entity.kind === 'API') {
      const api = entity as ApiEntity;
      doEmit(
        emit,
        selfRef,
        api.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
      doEmit(
        emit,
        selfRef,
        api.spec.system,
        { defaultKind: 'System', defaultNamespace: selfRef.namespace },
        RELATION_PART_OF,
        RELATION_HAS_PART,
      );
    }

    /*
     * Emit relations for the Resource kind
     */

    if (entity.kind === 'Resource') {
      const resource = entity as ResourceEntity;
      doEmit(
        emit,
        selfRef,
        resource.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
      doEmit(
        emit,
        selfRef,
        resource.spec.dependsOn,
        { defaultNamespace: selfRef.namespace },
        RELATION_DEPENDS_ON,
        RELATION_DEPENDENCY_OF,
      );
      doEmit(
        emit,
        selfRef,
        resource.spec.dependencyOf,
        { defaultNamespace: selfRef.namespace },
        RELATION_DEPENDENCY_OF,
        RELATION_DEPENDS_ON,
      );
      doEmit(
        emit,
        selfRef,
        resource.spec.system,
        { defaultKind: 'System', defaultNamespace: selfRef.namespace },
        RELATION_PART_OF,
        RELATION_HAS_PART,
      );
    }

    /*
     * Emit relations for the User kind
     */

    if (entity.kind === 'User') {
      const user = entity as UserEntity;
      doEmit(
        emit,
        selfRef,
        user.spec.memberOf,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_MEMBER_OF,
        RELATION_HAS_MEMBER,
      );
    }

    /*
     * Emit relations for the Group kind
     */

    if (entity.kind === 'Group') {
      const group = entity as GroupEntity;
      doEmit(
        emit,
        selfRef,
        group.spec.parent,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_CHILD_OF,
        RELATION_PARENT_OF,
      );
      doEmit(
        emit,
        selfRef,
        group.spec.children,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_PARENT_OF,
        RELATION_CHILD_OF,
      );
      doEmit(
        emit,
        selfRef,
        group.spec.members,
        { defaultKind: 'User', defaultNamespace: selfRef.namespace },
        RELATION_HAS_MEMBER,
        RELATION_MEMBER_OF,
      );
    }

    /*
     * Emit relations for the System kind
     */

    if (entity.kind === 'System') {
      const system = entity as SystemEntity;
      doEmit(
        emit,
        selfRef,
        system.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
      doEmit(
        emit,
        selfRef,
        system.spec.domain,
        { defaultKind: 'Domain', defaultNamespace: selfRef.namespace },
        RELATION_PART_OF,
        RELATION_HAS_PART,
      );
    }

    /*
     * Emit relations for the Domain kind
     */

    if (entity.kind === 'Domain') {
      const domain = entity as DomainEntity;
      doEmit(
        emit,
        selfRef,
        domain.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
    }

    return entity;
  }
}
