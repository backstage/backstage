/*
 * Copyright 2025 The Backstage Authors
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
  AddRelationFn,
  createFromZod,
  Entity,
  EntityMetadataSchema,
  EntitySchema,
  EntityValidator,
  RelationTuple,
  schemasToParser,
} from '@backstage/catalog-model';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  CatalogProcessorResult,
} from '@backstage/plugin-catalog-node';
import { defaultEntitySchemas } from './defaultEntitySchemas';

export class DefaultEntityModelProcessor implements CatalogProcessor {
  private customEntitySchemas: EntitySchema[] = [];
  private defaultEntityMetadataSchema: EntityMetadataSchema | undefined;
  private entitySchemaValidator: EntityValidator = this.createSchemaValidator();
  private relations: RelationTuple<CatalogProcessorResult[]>[] = [];

  getProcessorName() {
    return 'DefaultEntityModelProcessor';
  }

  async validateEntityKind?(entity: Entity): Promise<boolean> {
    const result = this.entitySchemaValidator.safeParse(entity);
    return result.success;
  }

  async postProcessEntity?(
    entity: Entity,
    location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    const z = createFromZod(zodImpl => zodImpl);
    for (const [validate, getRelations] of this.relations) {
      const schemas = validate(z);

      const entitySchema = schemas.entity ?? z.object({});
      const locationSchema = schemas.location ?? z.object({});

      if (
        entitySchema.safeParse(entity).success &&
        locationSchema.safeParse(location).success
      ) {
        const relations = getRelations(entity, location);
        for (const relation of relations) {
          emit(relation);
        }
      }
    }

    return entity;
  }

  addEntitySchema(...schemas: EntitySchema[]) {
    this.customEntitySchemas.push(...schemas);
    this.entitySchemaValidator = this.createSchemaValidator();
  }

  setDefaultEntityMetadataSchema(schema: EntityMetadataSchema) {
    this.defaultEntityMetadataSchema = schema;
    this.entitySchemaValidator = this.createSchemaValidator();
  }

  addRelation: AddRelationFn<CatalogProcessorResult[]> = (
    validator,
    relationFn,
  ) => {
    this.relations.push([validator, relationFn]);
  };

  private createSchemaValidator() {
    return schemasToParser(
      [...Object.values(defaultEntitySchemas), ...this.customEntitySchemas],
      this.defaultEntityMetadataSchema,
    );
  }
}
