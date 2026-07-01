/*
 * Copyright 2026 The Backstage Authors
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
  DEFAULT_NAMESPACE,
  Entity,
  getCompoundEntityRef,
  parseEntityRef,
} from '@backstage/catalog-model';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  processingResult,
} from '@backstage/plugin-catalog-node';
import lodash from 'lodash';
import { ModelHolder } from '../model/ModelHolder';
import { SchemaValidator } from './SchemaValidator';

export class ModelProcessor implements CatalogProcessor {
  readonly #modelHolder: ModelHolder;
  readonly #schemaValidator = new SchemaValidator();

  constructor(modelHolder: ModelHolder) {
    this.#modelHolder = modelHolder;
  }

  getProcessorName(): string {
    return 'ModelProcessor';
  }

  /**
   * For all fields in the entity that the model says are relations: if it's an
   * array of strings, sort that array. Since relations are unordered, this cuts
   * down on unnecessary processing and stitching for sources that don't have a
   * stable order for its output.
   */
  async preProcessEntity(entity: Entity): Promise<Entity> {
    const kind = this.#modelHolder.model.getKind(entity);
    if (kind) {
      for (const fieldModel of kind.relationFields) {
        const value = lodash.get(entity, fieldModel.path);
        if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
          value.sort();
        }
      }
    }

    return entity;
  }

  /**
   * If the model knows how to handle this entity, validate it against its
   * schema and then return true. Otherwise return false.
   */
  async validateEntityKind(entity: Entity): Promise<boolean> {
    const kind = this.#modelHolder.model.getKind(entity);
    if (!kind) {
      return false;
    }

    const errors = this.#schemaValidator.validate(kind.jsonSchema, entity);
    if (errors.length) {
      throw new TypeError(
        `Validation of ${entity.kind} entity failed: ${errors.join('; ')}`,
      );
    }

    return true;
  }

  /**
   * For all fields in the entity that the model says are relations: if the
   * field is a string or an array of strings, emit both the forward and reverse
   * relations that the model says apply for it.
   */
  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    const kind = this.#modelHolder.model.getKind(entity);
    if (!kind) {
      return entity;
    }

    const modelRelations =
      this.#modelHolder.model.getRelations({ kind: entity.kind }) ?? [];
    const selfRef = getCompoundEntityRef(entity);
    const selfNamespace = entity.metadata.namespace ?? DEFAULT_NAMESPACE;

    for (const fieldModel of kind.relationFields) {
      const fieldValue = lodash.get(entity, fieldModel.path);
      if (!fieldValue) {
        continue;
      }

      const shorthandRefs = (
        Array.isArray(fieldValue) ? fieldValue : [fieldValue]
      ).filter((x): x is string => x && typeof x === 'string');

      for (const shorthandRef of shorthandRefs) {
        const targetRef = parseEntityRef(shorthandRef, {
          defaultKind: fieldModel.defaultKind,
          defaultNamespace:
            fieldModel.defaultNamespace === 'inherit'
              ? selfNamespace
              : DEFAULT_NAMESPACE,
        });

        const targetKind = targetRef.kind.toLocaleLowerCase('en-US');

        if (
          fieldModel.allowedKinds &&
          !fieldModel.allowedKinds.some(
            k => k.toLocaleLowerCase('en-US') === targetKind,
          )
        ) {
          // TODO: Make this more visible. We should probably not use logging,
          // but if we added admonition support on entities, this would be a
          // good time to emit one.
          continue;
        }

        // Emit the forward relation
        emit(
          processingResult.relation({
            source: selfRef,
            type: fieldModel.relation,
            target: targetRef,
          }),
        );

        // Emit the reverse relation if the model knows about it
        const selfKind = entity.kind.toLocaleLowerCase('en-US');
        const relation = modelRelations.find(
          r =>
            r.forward.type === fieldModel.relation &&
            r.fromKind.some(k => k.toLocaleLowerCase('en-US') === selfKind) &&
            r.toKind.some(k => k.toLocaleLowerCase('en-US') === targetKind),
        );
        if (relation) {
          emit(
            processingResult.relation({
              source: targetRef,
              type: relation.reverse.type,
              target: selfRef,
            }),
          );
        }
      }
    }

    return entity;
  }
}
