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

import { readJsonSchema } from './jsonsSchema/readJsonSchema';
import { CatalogModelOp } from './operations';
import {
  CatalogModelBuilder,
  CatalogModelExtension,
  OpaqueCatalogModelExtension,
} from './types';

class CatalogModelBuilderImpl implements CatalogModelBuilder {
  readonly #modelName: string;
  readonly #ops: Array<CatalogModelOp>;

  constructor(modelName: string) {
    this.#modelName = modelName;
    this.#ops = [];
  }

  addJsonSchema(schema: unknown): void {
    const ops = readJsonSchema(schema);
    this.#ops.push(...ops);
  }

  build(): CatalogModelExtension {
    return OpaqueCatalogModelExtension.createInstance('v1', {
      modelName: this.#modelName,
      ops: this.#ops,
    });
  }
}

/**
 * Builds a representation of a catalog model extension. This (and others like
 * it) can then be registered with the catalog itself, where they will be merged
 * and validated into one unified model.
 *
 * @alpha
 * @remarks
 * @example
 *
 * ```ts
 * import mySchema from './jsonSchema.json';
 *
 * export const myCatalogModelExtension = createCatalogModelExtension(
 *   model => {
 *     model.addJsonSchema(mySchema);
 *   },
 * );
 * ```
 *
 * @param factory - A function that builds the catalog model extension.
 * @returns A catalog model extension.
 */
export function createCatalogModelExtension(options: {
  modelName: string;
  factory: (model: CatalogModelBuilder) => void;
}): CatalogModelExtension {
  const builder = new CatalogModelBuilderImpl(options.modelName);
  options.factory(builder);
  return builder.build();
}
