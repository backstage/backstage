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
  type CatalogModelAnnotationDefinition,
  opsFromCatalogModelAnnotation,
} from './modelActions/addAnnotation';
import {
  type CatalogModelKindDefinition,
  opsFromCatalogModelKind,
} from './modelActions/addKind';
import {
  type CatalogModelLabelDefinition,
  opsFromCatalogModelLabel,
} from './modelActions/addLabel';
import {
  type CatalogModelRelationPairDefinition,
  opsFromCatalogModelRelationPair,
} from './modelActions/addRelationPair';
import {
  type CatalogModelRemoveAnnotationDefinition,
  opsFromCatalogModelRemoveAnnotation,
} from './modelActions/removeAnnotation';
import {
  type CatalogModelRemoveKindDefinition,
  opsFromCatalogModelRemoveKind,
} from './modelActions/removeKind';
import {
  type CatalogModelRemoveLabelDefinition,
  opsFromCatalogModelRemoveLabel,
} from './modelActions/removeLabel';
import {
  type CatalogModelRemoveTagDefinition,
  opsFromCatalogModelRemoveTag,
} from './modelActions/removeTag';
import {
  type CatalogModelTagDefinition,
  opsFromCatalogModelTag,
} from './modelActions/addTag';
import {
  type CatalogModelUpdateAnnotationDefinition,
  opsFromCatalogModelUpdateAnnotation,
} from './modelActions/updateAnnotation';
import {
  CatalogModelUpdateKindDefinition,
  opsFromCatalogModelUpdateKind,
} from './modelActions/updateKind';
import {
  type CatalogModelUpdateLabelDefinition,
  opsFromCatalogModelUpdateLabel,
} from './modelActions/updateLabel';
import {
  CatalogModelUpdateRelationPairDefinition,
  opsFromCatalogModelUpdateRelationPair,
} from './modelActions/updateRelationPair';
import {
  type CatalogModelUpdateTagDefinition,
  opsFromCatalogModelUpdateTag,
} from './modelActions/updateTag';
import { CatalogModelOp } from './operations';
import { CatalogModelLayer, OpaqueCatalogModelLayer } from './types';

/**
 * A builder for catalog model layers.
 *
 * @alpha
 *
 * Plugins can use this builder to declare various contributions to the overall
 * catalog model, and registering the outcome with the catalog which then forms
 * a complete picture out of them.
 */
export interface CatalogModelLayerBuilder {
  /**
   * Adds a new kind to the model.
   */
  addKind(kind: CatalogModelKindDefinition): void;
  /**
   * Updates an existing kind in the model.
   */
  updateKind(kind: CatalogModelUpdateKindDefinition): void;
  /**
   * Removes a kind entirely from the model.
   */
  removeKind(kind: CatalogModelRemoveKindDefinition): void;

  /**
   * Adds a new relation pair to the model.
   */
  addRelationPair(relation: CatalogModelRelationPairDefinition): void;
  /**
   * Updates an existing relation pair in the model.
   */
  updateRelationPair(relation: CatalogModelUpdateRelationPairDefinition): void;

  /**
   * Adds a new annotation to the model.
   */
  addAnnotation(annotation: CatalogModelAnnotationDefinition): void;
  /**
   * Updates an existing annotation in the model.
   */
  updateAnnotation(annotation: CatalogModelUpdateAnnotationDefinition): void;
  /**
   * Removes an annotation from the model.
   */
  removeAnnotation(annotation: CatalogModelRemoveAnnotationDefinition): void;

  /**
   * Adds a new label to the model.
   */
  addLabel(label: CatalogModelLabelDefinition): void;
  /**
   * Updates an existing label in the model.
   */
  updateLabel(label: CatalogModelUpdateLabelDefinition): void;
  /**
   * Removes a label from the model.
   */
  removeLabel(label: CatalogModelRemoveLabelDefinition): void;

  /**
   * Adds a new tag to the model.
   */
  addTag(tag: CatalogModelTagDefinition): void;
  /**
   * Updates an existing tag in the model.
   */
  updateTag(tag: CatalogModelUpdateTagDefinition): void;
  /**
   * Removes a tag from the model.
   */
  removeTag(tag: CatalogModelRemoveTagDefinition): void;

  /**
   * Imports all operations from another catalog model layer into this one.
   */
  import(layer: CatalogModelLayer): void;
}

/**
 * The default implementation of the catalog model layer builder.
 */
export class DefaultCatalogModelLayerBuilder
  implements CatalogModelLayerBuilder
{
  readonly #layerId: string;
  readonly #ops: CatalogModelOp[];

  constructor(options: { layerId: string }) {
    this.#layerId = options.layerId;
    this.#ops = [];
  }

  addKind(kind: CatalogModelKindDefinition): void {
    const ops = opsFromCatalogModelKind(kind);
    this.#ops.push(...ops);
  }

  updateKind(kind: CatalogModelUpdateKindDefinition): void {
    const ops = opsFromCatalogModelUpdateKind(kind);
    this.#ops.push(...ops);
  }

  removeKind(kind: CatalogModelRemoveKindDefinition): void {
    const ops = opsFromCatalogModelRemoveKind(kind);
    this.#ops.push(...ops);
  }

  addRelationPair(relation: CatalogModelRelationPairDefinition): void {
    const ops = opsFromCatalogModelRelationPair(relation);
    this.#ops.push(...ops);
  }

  updateRelationPair(relation: CatalogModelUpdateRelationPairDefinition): void {
    const ops = opsFromCatalogModelUpdateRelationPair(relation);
    this.#ops.push(...ops);
  }

  addAnnotation(annotation: CatalogModelAnnotationDefinition): void {
    const ops = opsFromCatalogModelAnnotation(annotation);
    this.#ops.push(...ops);
  }

  updateAnnotation(annotation: CatalogModelUpdateAnnotationDefinition): void {
    const ops = opsFromCatalogModelUpdateAnnotation(annotation);
    this.#ops.push(...ops);
  }

  removeAnnotation(annotation: CatalogModelRemoveAnnotationDefinition): void {
    const ops = opsFromCatalogModelRemoveAnnotation(annotation);
    this.#ops.push(...ops);
  }

  addLabel(label: CatalogModelLabelDefinition): void {
    const ops = opsFromCatalogModelLabel(label);
    this.#ops.push(...ops);
  }

  updateLabel(label: CatalogModelUpdateLabelDefinition): void {
    const ops = opsFromCatalogModelUpdateLabel(label);
    this.#ops.push(...ops);
  }

  removeLabel(label: CatalogModelRemoveLabelDefinition): void {
    const ops = opsFromCatalogModelRemoveLabel(label);
    this.#ops.push(...ops);
  }

  addTag(tag: CatalogModelTagDefinition): void {
    const ops = opsFromCatalogModelTag(tag);
    this.#ops.push(...ops);
  }

  updateTag(tag: CatalogModelUpdateTagDefinition): void {
    const ops = opsFromCatalogModelUpdateTag(tag);
    this.#ops.push(...ops);
  }

  removeTag(tag: CatalogModelRemoveTagDefinition): void {
    const ops = opsFromCatalogModelRemoveTag(tag);
    this.#ops.push(...ops);
  }

  import(layer: CatalogModelLayer): void {
    const internal = OpaqueCatalogModelLayer.toInternal(layer);
    this.#ops.push(...internal.ops);
  }

  build(): CatalogModelLayer {
    return OpaqueCatalogModelLayer.createInstance('v1', {
      layerId: this.#layerId,
      ops: this.#ops.slice(),
    });
  }
}

/**
 * Creates a builder for a catalog model layer.
 *
 * @alpha
 * @remarks
 *
 * Plugins can use the resulting builder to declare various contributions to the
 * overall catalog model, and registering it with the catalog which then forms a
 * complete picture out of them.
 */
export function createCatalogModelLayerBuilder(options: {
  layerId: string;
}): CatalogModelLayerBuilder & { build(): CatalogModelLayer } {
  return new DefaultCatalogModelLayerBuilder(options);
}
