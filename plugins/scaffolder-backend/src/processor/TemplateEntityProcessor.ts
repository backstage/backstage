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
  Entity,
  getEntityName,
  LocationSpec,
  parseEntityRef,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  entityKindSchemaValidator,
} from '@backstage/catalog-model';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  results,
} from '@backstage/plugin-catalog-backend';
import {
  TemplateEntityV1beta3,
  templateEntityV1beta3Schema,
} from '@backstage/plugin-scaffolder-common';

export class TemplateEntityProcessor implements CatalogProcessor {
  private readonly validators = [
    entityKindSchemaValidator(templateEntityV1beta3Schema),
  ];

  async validateEntityKind(entity: Entity): Promise<boolean> {
    for (const validator of this.validators) {
      if (validator(entity)) {
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
    const selfRef = getEntityName(entity);

    if (
      entity.apiVersion === 'templates.backstage.io/v1beta3' &&
      entity.kind === 'Template'
    ) {
      const template = entity as TemplateEntityV1beta3;

      const target = template.spec.owner;
      if (target) {
        const targetRef = parseEntityRef(target, {
          defaultKind: 'Group',
          defaultNamespace: selfRef.namespace,
        });
        emit(
          results.relation({
            source: selfRef,
            type: RELATION_OWNED_BY,
            target: {
              kind: targetRef.kind,
              namespace: targetRef.namespace,
              name: targetRef.name,
            },
          }),
        );
        emit(
          results.relation({
            source: {
              kind: targetRef.kind,
              namespace: targetRef.namespace,
              name: targetRef.name,
            },
            type: RELATION_OWNER_OF,
            target: selfRef,
          }),
        );
      }
    }

    return entity;
  }
}
