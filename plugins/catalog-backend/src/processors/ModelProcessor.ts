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

import { Entity } from '@backstage/catalog-model';
import { CatalogModel } from '@backstage/catalog-model/alpha';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
} from '@backstage/plugin-catalog-node';

export class ModelProcessor implements CatalogProcessor {
  readonly #model: CatalogModel;

  constructor(model: CatalogModel) {
    this.#model = model;
  }

  getProcessorName(): string {
    return 'ModelProcessor';
  }

  async preProcessEntity(entity: Entity): Promise<Entity> {
    // const model = this.#model.getKind(entity);
    // const relations = this.#model.getRelations(entity.kind);
    // if (!model || !relations) {
    //   return entity;
    // }

    // for (const relation of model.relations) {
    //   lodash.get(entity, relation.path);
    // }
    // const relationValues = this.#collectRelationValues(entity, model);
    // for (const { value } of relationValues) {
    //   if (Array.isArray(value)) {
    //     // Relation generating arrays are order independent but are frequently
    //     // received in an unstable order during ingestion. We sort them to
    //     // ensure that we don't get unnecessary repetitive processing and
    //     // stitching that won't reult in a different outcome anyway.
    //     value.sort();
    //   }
    // }

    return entity;
  }

  async validateEntityKind(entity: Entity): Promise<boolean> {
    // const model = this.#model.getKind(entity.kind, entity.apiVersion);
    // if (!model) {
    //   return false;
    // }
    // return true;
    return false;
  }

  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    _emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    // const model = this.#model.getKind(entity.kind, entity.apiVersion);
    // const relations = this.#model.getRelations(entity.kind);
    // if (!model || !relations) {
    //   return entity;
    // }

    // const selfRef = getCompoundEntityRef(entity);
    // const relationValues = this.#collectRelationValues(entity, model);
    // for (const rv of relationValues) {
    //   const rawRefs = [rv.value].flat();
    //   for (const rawRef of rawRefs) {
    //     const target = parseEntityRef(rawRef, {
    //       defaultKind: rv.schema.defaultKind,
    //       defaultNamespace:
    //         rv.schema.defaultNamespace === 'default'
    //           ? DEFAULT_NAMESPACE
    //           : selfRef.namespace,
    //     });
    //     emit(
    //       processingResult.relation({
    //         source: selfRef,
    //         type: rv.schema.relation,
    //         target: target,
    //       }),
    //     );
    //     const matchingRelation = relations.find(
    //       r =>
    //         r.forward.type === rv.schema.relation &&
    //         r.toKind.some(
    //           k =>
    //             k.toLocaleLowerCase('en-US') ===
    //             target.kind.toLocaleLowerCase('en-US'),
    //         ),
    //     );
    //     if (matchingRelation) {
    //       emit(
    //         processingResult.relation({
    //           source: target,
    //           type: matchingRelation.reverse.type,
    //           target: selfRef,
    //         }),
    //       );
    //     }
    //   }
    // }

    return entity;
  }

  /**
   * Iterates through the entity and extracts all valid nodes (and the
   * corresponding schema) that are of type 'relation'.
   */
  #collectRelationValues(
    _entity: Entity,
    _kind: CatalogModelKind,
  ): Array<{
    value: string | string[];
    schema: CatalogModelSchemaRelationType;
  }> {
    const results: Array<{
      value: string | string[];
      schema: CatalogModelSchemaRelationType;
    }> = [];

    // function visit(
    //   entityNode: unknown,
    //   schemaDef: CatalogModelSchemaPropertyDefinition,
    // ) {
    //   if (!entityNode) {
    //     return;
    //   }

    //   if (schemaDef.type === 'relation') {
    //     if (typeof entityNode === 'string') {
    //       results.push({ value: entityNode, schema: schemaDef });
    //     } else if (
    //       Array.isArray(entityNode) &&
    //       entityNode.every(v => typeof v === 'string')
    //     ) {
    //       results.push({ value: entityNode as string[], schema: schemaDef });
    //     }
    //     return;
    //   }

    //   if (schemaDef.type === 'object') {
    //     if (typeof entityNode !== 'object' || Array.isArray(entityNode)) {
    //       return;
    //     }
    //     const obj = entityNode as Record<string, unknown>;
    //     for (const [key, propSchema] of Object.entries(schemaDef.properties)) {
    //       if (key in obj) {
    //         visit(obj[key], propSchema);
    //       }
    //     }
    //     return;
    //   }

    //   if (schemaDef.type === 'array' && schemaDef.items) {
    //     if (!Array.isArray(entityNode)) {
    //       return;
    //     }
    //     for (const element of entityNode) {
    //       visit(element, schemaDef.items);
    //     }
    //   }
    // }

    // const spec = entity.spec;
    // if (spec && typeof spec === 'object' && !Array.isArray(spec)) {
    //   const specObj = spec as Record<string, unknown>;
    //   for (const [key, propSchema] of Object.entries(kind.spec.properties)) {
    //     if (key in specObj) {
    //       visit(specObj[key], propSchema);
    //     }
    //   }
    // }

    return results;
  }
}
