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
  type CatalogModelKindDefinition,
  opsFromCatalogModelKind,
} from './modelActions/addKind';
import {
  type CatalogModelRelationPairDefinition,
  opsFromCatalogModelRelationPair,
} from './modelActions/addRelationPair';
import { CatalogModelOp } from './operations';
import { CatalogModelExtension, OpaqueCatalogModelExtension } from './types';

/**
 * A builder for catalog model extensions.
 *
 * @alpha
 *
 * Plugins can use this builder to declare various contributions to the overall
 * catalog model, and registering the outcome with the catalog which then forms
 * a complete picture out of them.
 */
export interface CatalogModelExtensionBuilder {
  /**
   * Adds a new kind to the model.
   */
  addKind(kind: CatalogModelKindDefinition): void;

  /**
   * Adds a new relation pair to the model.
   */
  addRelationPair(relation: CatalogModelRelationPairDefinition): void;
}

/**
 * The default implementation of the catalog model extension builder.
 */
export class DefaultCatalogModelExtensionBuilder
  implements CatalogModelExtensionBuilder
{
  readonly #pluginId: string;
  readonly #modelName?: string;
  readonly #ops: CatalogModelOp[];

  constructor(options: { pluginId: string; modelName?: string }) {
    this.#pluginId = options.pluginId;
    this.#modelName = options.modelName;
    this.#ops = [];
  }

  addKind(kind: CatalogModelKindDefinition): void {
    const ops = opsFromCatalogModelKind(kind);
    this.#ops.push(...ops);
  }

  addRelationPair(relation: CatalogModelRelationPairDefinition): void {
    const ops = opsFromCatalogModelRelationPair(relation);
    this.#ops.push(...ops);
  }

  build(): CatalogModelExtension {
    return OpaqueCatalogModelExtension.createInstance('v1', {
      pluginId: this.#pluginId,
      modelName: this.#modelName,
      ops: this.#ops.slice(),
    });
  }
}

/**
 * Creates a builder for a catalog model extension.
 *
 * @alpha
 * @remarks
 *
 * Plugins can use the resulting builder to declare various contributions to the
 * overall catalog model, and registering it with the catalog which then forms a
 * complete picture out of them.
 */
export function createCatalogModelExtensionBuilder(options: {
  pluginId: string;
  modelName?: string;
}): CatalogModelExtensionBuilder & { build(): CatalogModelExtension } {
  return new DefaultCatalogModelExtensionBuilder(options);
}
